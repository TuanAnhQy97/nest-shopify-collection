const AppService = {
    parseTags: tags => {
        let country = '',
            location = '',
            roaster = '',
            flavors = [];
        const testStrings = ['Country', 'Location', 'Roaster', 'Flavor'];
        const parseData = data => {
            return data
                .split('_')
                .pop()
                .split('-')
                .join(' ');
        };
        tags.map(tag => {
            const matchedEl = testStrings.find(testString =>
                tag.includes(testString),
            );
            if (!matchedEl) return;
            else if (matchedEl === 'Country') country = parseData(tag);
            else if (matchedEl === 'Location') location = parseData(tag);
            else if (matchedEl === 'Flavor') flavors.push(parseData(tag));
            else if (matchedEl === 'Roaster') roaster = parseData(tag);
        });

        return {
            country,
            location,
            flavors,
            roaster,
        };
    },

    formatCurrency: price => {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        return formatter.format(+price);
    },

    parseURL: url => {
        let tags = [];
        let sortBy = '';
        if (!url)
            return {
                tags,
                sortBy,
            };
        const keys = url.split('?');
        if (keys.length === 2) {
            tags = keys.shift().split('+');
            sortBy = keys
                .pop()
                .split('=')
                .pop();
        } else if (keys.length === 1) {
            if (keys[0].includes('sort_by'))
                sortBy = keys
                    .pop()
                    .split('=')
                    .pop();
            else tags = keys.shift().split('+');
        }

        return {
            tags,
            sortBy,
        };
    },
};

export default AppService;
