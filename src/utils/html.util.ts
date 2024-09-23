
const handleStringBlock = (template: string, data: Record<string, any>) => {
    const regex = /{{\s*([^{}\s]+)\s*}}/g;
    return template.replace(regex, (_, key) => {
        return data[key] || '';
    });
};

// template is in handlebars format, so let's build a compiler for it
const compileMjml = (template: string, data: Record<string, any>) => {
    const eachBlockRegex = /{{#each recommendedProducts}}([\s\S]*?){{\/each}}/gm;
    const eachBlockMatches = template.match(eachBlockRegex);
    
    // If we find an each block, we handle it
    if (eachBlockMatches) {
        eachBlockMatches.forEach(eachBlockMatch => {
            const block = eachBlockMatch.replace(/{{#each recommendedProducts}}|{{\/each}}/g, '').trim();
            const compiledBlock = data.recommendedProducts.map((product: any) => handleStringBlock(block, product)).join('');
            template = template.replace(eachBlockMatch, compiledBlock);
        });
    }

    // handle the string blocks outside of the each block
    return handleStringBlock(template, data);
};


export { compileMjml };
