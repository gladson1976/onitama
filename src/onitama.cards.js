const COLORS = {
    red: '#FFA500',
    green: '#00FF00',
    blue: '#191970',
    player: '#292929',
    wind: '#000080'
};
const RANK_COLORS = {
    red: '#FFA500',
    blue: '#87CEEB'
};

const onitamaPacks = [
    {pack: 'Onitama', image: '', cards: [
        {id: 1, name: 'Tiger', glyph: '虎', color: 'green', rank: 'blue', moves: [2, 17]},
        {id: 2, name: 'Crab', glyph: '蟹', color: 'green', rank: 'blue', moves: [7, 10, 14]},
        {id: 3, name: 'Monkey', glyph: '猴', color: 'green', rank: 'blue', moves: [6, 8, 16, 18]},
        {id: 4, name: 'Crane', glyph: '鹤', color: 'green', rank: 'blue', moves: [7, 16, 18]},
        {id: 5, name: 'Dragon', glyph: '虬', color: 'green', rank: 'red', moves: [5, 9, 16, 18]},
        {id: 6, name: 'Elephant', glyph: '象', color: 'green', rank: 'red', moves: [6, 8, 11, 13]},
        {id: 7, name: 'Mantis', glyph: '螳', color: 'green', rank: 'red', moves: [6, 8, 17]},
        {id: 8, name: 'Boar', glyph: '彘', color: 'green', rank: 'red', moves: [7, 11, 13]},
        {id: 9, name: 'Frog', glyph: '蛙', color: 'blue', rank: 'red', moves: [6, 10, 18]},
        {id: 10, name: 'Goose', glyph: '鹅', color: 'blue', rank: 'blue', moves: [6, 11, 13, 18]},
        {id: 11, name: 'Horse', glyph: '马', color: 'blue', rank: 'red', moves: [7, 11, 17]},
        {id: 12, name: 'Eel', glyph: '鳗', color: 'blue', rank: 'blue', moves: [6, 13, 16]},
        {id: 13, name: 'Rabbit', glyph: '兔', color: 'red', rank: 'blue', moves: [8, 14, 16]},
        {id: 14, name: 'Rooster', glyph: '鸡', color: 'red', rank: 'red', moves: [8, 11, 13, 16]},
        {id: 15, name: 'Ox', glyph: '牛', color: 'red', rank: 'blue', moves: [7, 13, 17]},
        {id: 16, name: 'Cobra', glyph: '蛇', color: 'red', rank: 'red', moves: [8, 11, 18]}
    ]},
    {pack: 'Sensei\'s Path', image: '', cards: [
        {id: 17, name: 'Giraffe', glyph: '颈鹿', color: 'green', rank: 'blue', moves: [5, 9, 17]},
        {id: 18, name: 'Kirin', glyph: '麒麟', color: 'green', rank: 'red', moves: [1, 3, 22]},
        {id: 19, name: 'Phoenix', glyph: '凤凰', color: 'green', rank: 'blue', moves: [6, 8, 10, 14]},
        {id: 20, name: 'Turtle', glyph: '龟', color: 'green', rank: 'red', moves: [10, 14, 16, 18]},
        {id: 21, name: 'Fox', glyph: '狐', color: 'red', rank: 'red', moves: [8, 13, 18]},
        {id: 22, name: 'Panda', glyph: '猫熊', color: 'red', rank: 'red', moves: [7, 8, 16]},
        {id: 23, name: 'Sea\nSnake', glyph: '海蛇', color: 'red', rank: 'blue', moves: [7, 14, 16]},
        {id: 24, name: 'Mouse', glyph: '鼠标', color: 'red', rank: 'blue', moves: [7, 13, 16]},
        {id: 25, name: 'Tanuki', glyph: '狸', color: 'red', rank: 'blue', moves: [7, 9, 16]},
        {id: 26, name: 'Sable', glyph: '黑貂', color: 'red', rank: 'blue', moves: [8, 10, 16]},
        {id: 27, name: 'Dog', glyph: '狗', color: 'blue', rank: 'blue', moves: [6, 11, 16]},
        {id: 28, name: 'Bear', glyph: '熊', color: 'blue', rank: 'blue', moves: [6, 7, 18]},
        {id: 29, name: 'Viper', glyph: '蛇', color: 'blue', rank: 'red', moves: [7, 10, 18]},
        {id: 30, name: 'Rat', glyph: '鼠', color: 'blue', rank: 'red', moves: [7, 11, 18]},
        {id: 31, name: 'Iguana', glyph: '鬣蜥', color: 'blue', rank: 'red', moves: [5, 7, 18]},
        {id: 32, name: 'Otter', glyph: '颈鹿', color: 'blue', rank: 'red', moves: [6, 14, 18]}
    ]},
    {pack: 'Way of the Wind', image: '', cards: [
        {id: 33, name: 'Goat', glyph: '羊山', color: 'red', rank: 'red', moves: [8, 11, 17]},
        {id: 34, name: 'Sheep', glyph: '羊', color: 'blue', rank: 'blue', moves: [6, 13, 17]},
        {id: 35, name: 'Eagle', glyph: '鹰', color: 'green green', rank: 'red', moves: [[1, 3], [0, 4]]},
        {id: 36, name: 'Lion', glyph: '狮', color: 'red green', rank: 'red', moves: [[3, 11], [2, 7]]},
        {id: 37, name: 'Scorpion', glyph: '蝎', color: 'red green', rank: 'blue', moves: [[3, 13], [1, 3, 5, 9]]},
        {id: 38, name: 'Spider', glyph: '蜘蛛', color: 'red green', rank: 'red', moves: [[3, 12], [1, 2, 3, 12]]},
        {id: 39, name: 'Bat', glyph: '蝙蝠', color: 'green green', rank: 'blue', moves: [[2, 12], [5, 6, 8, 9]]},
        {id: 40, name: 'Octopus', glyph: '蛸', color: 'blue green', rank: 'blue', moves: [[1, 13], [2, 6, 8, 11, 12, 13]]},
        {id: 41, name: 'Hawk', glyph: '鹰鹰', color: 'blue green', rank: 'blue', moves: [[1, 11], [5, 9, 10, 14]]},
        {id: 42, name: 'Rhino', glyph: '牛', color: 'blue green', rank: 'red', moves: [[1, 12], [6, 7, 8, 10, 14]]}
    ]}
];

export { onitamaPacks };