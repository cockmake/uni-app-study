import sha256 from 'crypto-js/sha256';

// 对密码进行哈希加密（不可逆）
const encryptPassword = (password) => {
    return sha256(password).toString();
};

export {encryptPassword}