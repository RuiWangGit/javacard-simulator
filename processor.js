var installJS = require('./installer.js');
var apduJS = require('./java.framework/APDU.js');
var jcvm = require('./jcvm.js');
var opcodes = require('./opcodes.js');

function APDUProcessor(javacard){
	this.javacard = javacard;
	this.response = undefined;
	this.CLA = undefined;
	this.INS = undefined;
	this.P1 = undefined;
	this.P2 = undefined;
	this.LC = undefined;
	this.apdu = undefined;
	this.selectedAID = undefined;
	this.appletInstance = undefined;
	this.installerAID = [0xA0,0x00,0x00,0x00,0x62,0x03,0x01,0x08,0x01];//merge into installer
	this.installer = new installJS.Installer(javacard);//Should this be moved down? --> YES when select install applet, just realised it messed up probably due to installer boolean down there \/

	this.process = function(buffer){
		this.apdu = new apduJS.APDU();
        this.apdu.constr(buffer);
        this.javacard.EEPROM.objectheap[0] = this.apdu;
        this.response = ""; //gSW
        this.javacard.RAM.asyncState = false;
        this.javacard.RAM.transaction_flag = false;
        this.javacard.RAM.transaction_buffer = [];

        this.CLA = buffer[0];    //@adam class of instruction, category
        this.INS = buffer[1];    //@adam instruction
        this.P1 = buffer[2];     //@adam parameter 1
        this.P2 = buffer[3];     //@adam parameter 2
        this.LC = buffer[4];     //@adam length of command data

        var found = false;



        //@adam if select applet command
        if ((this.CLA == 0) && (this.INS == 0xA4) && (this.P1 == 0x04) && (this.P2 == 0x00)) {
            return this.selectApplet(buffer.slice(5,5+this.LC)); //TODO --> should probably return here
        } else {
            javacard.RAM.select_statement_flag = 0;
        }

        if((this.javacard.EEPROM.selectedApplet.AID.join() === this.installerAID.join()) && (this.CLA == 0x80)){
            return this.installer.execute(buffer);
        } 
        var startcode = this.javacard.EEPROM.selectedApplet.CAP.getStartCode(this.javacard.EEPROM.selectedApplet.AID, 7);
        var params = [];
        params[0] = 0;
        jcvm.executeBytecode(this.javacard.EEPROM.selectedApplet.CAP, startcode, params, 0,
            this.javacard.EEPROM.selectedApplet.appletRef, this.javacard);

        var output = ""
            if (this.apdu.getCurrentState() >= 3) {
                for (var k = 0; k < this.apdu.getBuffer().length; k++) {
                    output += addX(addpad(this.apdu.getBuffer()[k])) + " ";
                    //output += this.apdu.getBuffer()[k] + "";
                }
            }
        //return strout + " " + response; << haven't implemented code that uses strout yet
        return output + this.response;
	}

	this.selectApplet = function(appletAID){
        this.javacard.RAM.transient_data = []; //reset transient data --> instead create new ram?
        this.javacard.RAM.select_statement_flag = 1;

        //delect curent applet
        this.selectedAID = []; //not the way to deselect, see code below
        //set applet aid and cap file in eeprom
        if(this.javacard.EEPROM.setSelectedApplet(appletAID)){
            if(this.javacard.EEPROM.selectedApplet.AID.join() === this.installerAID.join()){
                return "0x9000"//if installer then the rest is not necessary
            }

            for(var j = 0; j < this.javacard.EEPROM.selectedApplet.CAP.COMPONENT_Import.count; j++) { 
                if(this.javacard.EEPROM.selectedApplet.CAP.COMPONENT_Import.packages[j].AID.join() === opcodes.jframework.join()) {
                    this.javacard.EEPROM.setHeapValue(0, 160 + (j*256) + 10);
                    break;
                }
            }
            
            var startcode = this.javacard.EEPROM.selectedApplet.CAP.getStartCode(appletAID, 6);
            var params = [];

            //if the applet has an install method, run it.
            if (startcode > 0) {
                jcvm.executeBytecode(this.javacard.EEPROM.selectedApplet.CAP, startcode, params, 2,
                    this.javacard.EEPROM.selectedApplet.appletRef, this.javacard);
            }

            //if install method (above) executed sucessfully, start process method
            if(true){
                startcode = this.javacard.EEPROM.selectedApplet.CAP.getStartCode(appletAID, 7);
                params[0] = 0;
                jcvm.executeBytecode(this.javacard.EEPROM.selectedApplet.CAP, startcode, params, 0, this.javacard.EEPROM.selectedApplet.appletRef,
                    this.javacard);
            }

            if(true){//if the method above fails reset selectapplet
                return "0x9000";
            } else {
                this.javacard.EEPROM.selectedApplet = null;
            }
            
        } else {
            return "0x6A82";
        }

        if (appletAID.join() === this.installerAID.join()) {
            this.selectedAID = this.installerAID;
            console.log("installerAID " + this.installerAID + "selectedAID: " + this.selectedAID + ".");
            //create installer applet and send it reference to the EEPROM so that it can program the card :-) <-- didn't work moving that code up to the top
            console.log("E@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            console.log(this.javacard.EEPROM);


            //could add help message to return (e.g. selected AID is ...)

            found = true;//TODO --> should probably return here too? instead of keep using response variable.
        } else {
            //TODO convert to integer storage


        }

        if (!found) {
            this.response = "0x6A82"; //@adam no applet found code
        } else {
            if (this.response == "") { this.response = "0x9000"; }; //@adam succesful execution
        }

        return this.response;
    }
}

function addpad(d) {
    var hex = Number(d).toString(16);

    while (hex.length < 2) {
        hex = "0" + hex;
    }

    return hex; //"0x" +
}

function addX(d) { return "0x" + d;}

exports.APDUProcessor = APDUProcessor;