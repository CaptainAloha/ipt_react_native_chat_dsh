export const calculateTextColor = (text: string) => {
    let hash = 0;
    text.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += value.toString(16).padStart(2, '0')
    }
    return colour
};

export const theme = {
    headerBackgroundColor: '#0084FFB2',
    headerColor: '#ffffff',

};