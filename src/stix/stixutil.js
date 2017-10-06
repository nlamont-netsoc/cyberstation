
export const labelsNames = [
    "anomalous-activity",
    "anonymization",
    "benign",
    "organization",
    "compromised",
    "malicious-activity",
    "attribution"
];

export const relationshipsNames = [
    "attributed-to",
    "targets",
    "uses",
    "mitigates",
    "indicates",
    "variant-of",
    "impersonates"
];

// basic check of the url string
export function isValidURL(str) {
    if (str) {
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?' + // port
            '(\\/[-a-z\\d%_.~+&:]*)*' + // path
            '(\\?[;&a-z\\d%_.,~+&:=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    } else {
        return false;
    }
};