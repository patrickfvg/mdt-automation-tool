// script.js
document.getElementById('formulaGeneratorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get values from form
    const dataCenterURL = document.getElementById('dataCenterUrl').value;
    const tabName = document.getElementById('tabName').value;
    const includeFolder = document.getElementById('includeFolder').value;
    const excludeFoldersValue = document.getElementById('excludeFolders').value;
    const excludeFolders = excludeFoldersValue ? excludeFoldersValue.split(',') : [];

    // Generate the formula
    const formula = generateFormula(dataCenterURL, tabName, includeFolder, excludeFolders);

    // Display the formula
    document.getElementById('result').textContent = formula;
});

function generateFormula(dataCenterURL, tabName, includeFolder, excludeFolders) {
    const importRange = `IMPORTRANGE("${dataCenterURL}", "${tabName}!A:A")`;

    let searchPart = `ISNUMBER(SEARCH("${includeFolder}", ${importRange}))`;
    excludeFolders.forEach((folder) => {
        const trimmedFolder = folder.trim();
        if (trimmedFolder) {
            searchPart += `, NOT(ISNUMBER(SEARCH("${trimmedFolder}", ${importRange})))`;
        }
    });

    return `=SORT(FILTER(${importRange}, ${searchPart}), 1, TRUE)`;
}
