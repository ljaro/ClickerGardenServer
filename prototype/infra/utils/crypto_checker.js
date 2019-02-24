'use strict';
const crypto = require('crypto');

class CryptoChecker {
    constructor() {
    }

    async compare(dbPass, userPass, dbSalt) {
        return new Promise(resolve => {
            try {
                const derivedKey = crypto.scryptSync(userPass, dbSalt, 64);

                if(derivedKey instanceof Buffer) {
                    const k1 = derivedKey;
                    const k2 = dbPass;

                    if(k1 && k2 && k1.compare(k2) === 0) {
                        resolve(true);
                        return;
                    }
                }
            } catch (e) {
                resolve(false);
            }

            resolve(false);
        });
    }


}

exports.CryptoChecker = CryptoChecker