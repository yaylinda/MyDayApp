import moment from 'moment';

// export const HOST = 'http://localhost:8080/my-day-backend';
export const HOST = 'https://api.lindazheng.me/my-day-backend';

export const COLORS = {
    BACKGROUND_MAIN: '#282833',
    BACKGROUND_LIGHT: '#32323e',
    BACKGORUND_ACCENT: '#40424f',
    TEXT_MAIN: '#52e3c2',
    TEXT_ACCENT: '#ff4495',
    TEXT_LIGHT_WHITE: '#b4b8cd',
}

export const EMOJI_REGEX_PATTERN = '(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])'

export const capitalizeFromUpper = (upper) => {
    return upper.charAt(0) + upper.substr(1).toLowerCase();
}

export const formatDecimal = (value) => {
    if (value === 0) {
        return 0;
    } else {
        return parseFloat(value).toFixed(2);
    }
}

export const formatDate = (date) => {
    return moment(date, "YYYY-MM-DD").format('ddd, MMM Do YYYY');
}


/*
    --atom-red: #ff4495;
    --atom-green: #52e3c2;
    --atom-blue: #0781ff;
    --atom-purple: #d211fe;
    --atom-bright-orange: #ff4b12;
    --atom-yellow: #ffd900;
    --atom-orange: #ed8a19;
    --atom-light-blue: #40c4ff;
    --atom-gray: #546e7a;
    --atom-brand-0: #1a1a21;
    --atom-brand-1: #282833;
    --atom-brand-2: #32323e;
    --atom-brand-3: #393945;
    --atom-brand-4: #40424f;
    --atom-brand-5: #4d505f;
    --atom-brand-6: #6e7288;
    --atom-brand-7: #8f94ab;
    --atom-brand-8: #b4b8cd;
    --atom-contrast: #fff;
 */