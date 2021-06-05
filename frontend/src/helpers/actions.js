module.exports.spinWheel = function spinWheel() {
    const wheelOptions = [
        'Lose a Turn',
        '800',
        '500',
        '650',
        '500',
        '900',
        'Bankrupt',
        '5000',
        '500',
        '600',
        '700',
        '600',
        '650',
        '500',
        '700',
        '500',
        '600',
        '550',
        '500',
        '600',
        'Bankrupt',
        '650',
        'Free Play',
        '700'
    ]
    const spin = Math.floor(Math.random() * 24);
    return wheelOptions[spin];
    // return "Bankrupt"
}