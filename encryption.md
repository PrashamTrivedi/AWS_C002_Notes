---
title: Notes on Encryption(Extra)
---

# Encryption

This is a general notes regarding ot encryption. It's not related to any specific aws feature.

## Encryption
- **Encryption at rest**: 
    - Keys are stored in same device/stored with same person with whom the data is being store.
    - Used when only one entity is involved.
    - Same Key is used to encrypt and decrypt the data.
    - E.g. Laptop password, Device fingerprint.
- **Encryption in transit**:
    - Keys are stored in all devices/parties betweeen whom the data is being transferred.
    - Used when more than one entity is involved.
    - E.g.: Bank Transaction, Secure Chat.

- **Symmetric Encryption**:
    - Same key is used to encrypt and decrypt the data.
    - More easy to compute.
    - Key must be shared between parties. That makes the encryption useless.
    - Good for local encryption or disk encryption.
- **Asymmetric Encryption**:
    - Different key is used to encrypt and decrypt the data.
    - Two set of keys: public key and private key.
    - Public keys are shared openly in the world.
    - Private keys are stored with the receiever.
    - Public keys are used to encrypt the data, and private keys are used to decrypt the data.
    
    - ## Signing
        - When sending message, sender signs that message with the private key, and reciever can verify the sender using sender's public key.
        - This is inverse of what discussed above, in signing encryption happens with private key and decryption happens with public key.
        
        - Like when A is sending message to B. 
        - A encrypts the message using B's public key and signs this with A's private key. 
        - When B recieves this, only B can read this message with his private key, and verify that it's sent by A by decrypting the signature using A's public key.
