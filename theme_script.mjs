import fs from 'fs';

let content = fs.readFileSync('pages/iatf/[id].vue', 'utf8');

// Replace classes to support Light Mode
const map = {
    'bg-gray-900': 'bg-white dark:bg-gray-900',
    'bg-gray-950': 'bg-gray-50 dark:bg-gray-950',
    'bg-gray-800': 'bg-gray-100 dark:bg-gray-800',
    'text-white': 'text-gray-900 dark:text-white',
    'text-gray-300': 'text-gray-700 dark:text-gray-300',
    'text-gray-400': 'text-gray-500 dark:text-gray-400',
    'text-brand-100': 'text-white dark:text-brand-100',
    'border-brand-800': 'border-brand-300 dark:border-brand-800',
    'divide-brand-800': 'divide-brand-300 dark:divide-brand-800',
    'border-gray-700': 'border-gray-200 dark:border-gray-700',
    'divide-gray-700': 'divide-gray-200 dark:divide-gray-700'
};

// We only want to replace within the <template> blocks to avoid breaking scripts.
const templateMatch = content.match(/<template>[\s\S]*?<\/template>/);
if (templateMatch) {
    let templateArgs = templateMatch[0];

    for (const [dark, lightDark] of Object.entries(map)) {
        // only replace if not already replaced (prevent doubling up)
        const regex = new RegExp(`(?<!dark:)\\b${dark}\\b`, 'g');
        templateArgs = templateArgs.replace(regex, lightDark);
    }

    content = content.replace(templateMatch[0], templateArgs);
    fs.writeFileSync('pages/iatf/[id].vue', content, 'utf8');
    console.log('Successfully injected Light Mode classes into IATF template.');
} else {
    console.log('Template not found.');
}
