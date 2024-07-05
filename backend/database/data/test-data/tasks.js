module.exports = [
    {
        user_id: '2',
        name: 'Exercise',
        check_in_dates: {
            '2024/01/03': true
        },
        question: 'Have you gone for a run?',
        colour_hex: '0000FF',
        icon: 'exercise-icon'
    },
    {
        user_id: '2',
        name: 'Game Daily Reset',
        check_in_dates: {
            '2024/01/03': true
        },
        question: 'Have you done your dailies?',
        colour_hex: 'FF0000',
        icon: 'game-icon',
        reset_time: '03:00'
    },
    {
        user_id: '3',
        name: 'Jogging',
        check_in_dates: {
            '2024/01/01': true,
            '2024/01/02': false,
            '2024/01/03': true
        },
        colour_hex: '00FF00',
    },
    {
        user_id: '3',
        name: 'Routine',
        check_in_dates: {
            '2024/01/01': true,
            '2024/01/02': true,
            '2024/01/03': true
        },
        question: 'Did you do it today?'
    },
    {
        user_id: '3',
        name: 'Test',
        check_in_dates: {
            '2024/01/01': false,
            '2024/01/02': false,
            '2024/01/03': false
        }
    }
];