export type RowValueRating = Record<number, number>

export const defaultWavesSizePrefered: number = 7

// Mapping Wave Size => Rating
export const wavesRowValueRating: RowValueRating = {
    1: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6, // This is the prefered value
    9: 7,
    10: 8,
    11: 9,
    12: 10,
}

// Mapping Energy Size => Rating
export const energyRowValueRating: RowValueRating = {
    100: 1,
    200: 2,
    400: 3,
    500: 4,
    700: 5,
    1200: 6,
    1500: 7,
    2000: 8,
    3000: 9,
    4000: 10,
}

// Mapping Swell Period => Rating
export const swellRowValueRating: RowValueRating = {
    0: 1,
    6: 2,
    8: 3,
    10: 4,
    13: 5,
    16: 6,
    18: 7,
    19: 8,
    20: 9,
    22: 10,
}


// Mapping Wind Size => Rating
export const windRowValueRating: RowValueRating = {
    1: 1,
    4: 2,
    5: 3,
    6: 4,
    7: 5,
    8: 6,
    12: 7,
    15: 8,
    20: 9,
    35: 10,
}

export const cloudRowValueRating: RowValueRating = {
    0: 1,
    0.1: 2,
    10: 3,
    20: 4,
    50: 5,
    60: 6,
    70: 7,
    80: 8,
    90: 9,
    100: 10,
}

export const weatherRowValueRating: RowValueRating = {
    5: 1,
    10: 2,
    15: 3,
    18: 4,
    22: 5,
    26: 6,
    30: 7,
    33: 8,
    36: 9,
    40: 10,
}


export const rainRowValueRating: RowValueRating = {
    3: 1,
    6: 2,
    9: 3,
    12: 4,
    15: 5,
    20: 6,
    30: 7,
    40: 8,
    60: 9,
    100: 10,
}
