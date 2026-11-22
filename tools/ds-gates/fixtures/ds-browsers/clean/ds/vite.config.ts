import browserslist from 'browserslist';
const targets = browserslist(undefined, { path: import.meta.dirname });
export default { build: { target: targets, cssTarget: targets } };
