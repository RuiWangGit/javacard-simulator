﻿/*!
 * ISO7816
 *
 * Creates a HashMap used to Map the Hex values of ISO7816 to their textual
 * description.
 * 
 * @author Adam Noakes
 * University of Southampton
 */

/**
 * Module depedencies
 * @private
 */
var HashMap = require('hashmap');

/**
 * Create HashMap and initialise.
 */
var ISO7816 = new HashMap();

ISO7816.set('SW_NO_ERROR', 0x9000);
ISO7816.set('SW_NO_ERROR', 0x9000);
ISO7816.set('SW_BYTES_REMAINING_00', 0x6100);
ISO7816.set('SW_WRONG_LENGTH', 0x6700);
ISO7816.set('SW_VERIFICATION_FAILED', 0x6300);
ISO7816.set('SW_PIN_VERIFICATION_REQUIRED', 0x6301);
ISO7816.set('SW_SECURITY_STATUS_NOT_SATISFIED', 0x6982);
ISO7816.set('SW_FILE_INVALID', 0x6983);
ISO7816.set('SW_DATA_INVALID', 0x6984);
ISO7816.set('SW_CONDITIONS_NOT_SATISFIED', 0x6985);
ISO7816.set('SW_COMMAND_NOT_ALLOWED', 0x6986);
ISO7816.set('SW_APPLET_SELECT_FAILED', 0x6999);
ISO7816.set('SW_WRONG_DATA', 0x6A80);
ISO7816.set('SW_FUNC_NOT_SUPPORTED', 0x6A81);
ISO7816.set('SW_FILE_NOT_FOUND', 0x6A82);
ISO7816.set('SW_RECORD_NOT_FOUND', 0x6A83);
ISO7816.set('SW_INCORRECT_P1P2', 0x6A86);
ISO7816.set('SW_WRONG_P1P2', 0x6B00);
ISO7816.set('SW_CORRECT_LENGTH_00', 0x6C00);
ISO7816.set('SW_INS_NOT_SUPPORTED', 0x6D00);
ISO7816.set('SW_CLA_NOT_SUPPORTED', 0x6E00);
ISO7816.set('SW_UNKNOWN', 0x6F00);
ISO7816.set('SW_FILE_FULL', 0x6A84);
ISO7816.set('SW_LOGICAL_CHANNEL_NOT_SUPPORTED', 0x6881);
ISO7816.set('SW_SECURE_MESSAGING_NOT_SUPPORTED', 0x6882);
ISO7816.set('SW_WARNING_STATE_UNCHANGED', 0x6200);
ISO7816.set('SW_LAST_COMMAND_EXPECTED', 0x6883);
ISO7816.set('SW_COMMAND_CHAINING_NOT_SUPPORTED', 0x6884);
ISO7816.set('INS_SELECT', 0xA4);
ISO7816.set('INS_EXTERNAL_AUTHENTICATE', 0x82);

ISO7816.set('OFFSET_CLA', 0);
ISO7816.set('OFFSET_INS', 1);
ISO7816.set('OFFSET_P1', 2);
ISO7816.set('OFFSET_P2', 3);
ISO7816.set('OFFSET_LC', 4);
ISO7816.set('OFFSET_CDATA', 5);
ISO7816.set('OFFSET_EXT_CDATA', 7);
ISO7816.set('CLA_ISO7816', 0);

/**
 * Export HashMap
 */

module.exports = ISO7816;