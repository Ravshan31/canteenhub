export const parseJwt = (token) => {
    const base64Payload = token.split('.')[1];
    if (base64Payload) {
        Buffer.from(base64Payload, 'base64');
        return true;
    }
    return false;
}