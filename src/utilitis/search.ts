
export default new class {

    toleranz: number = 1;

    list (query: string, array: any, param: string = "name") {

        let res = this.generateList(query, array, param);

        res = res.sort(this.compareValues('points', 'desc'));

        let r = [];
        for (const item of res) {
            if (item.points !== 0) r.push(item);
        }

        return r;

    }

    compareValues (key: string, order = 'asc') {
        return function (a: any, b: any) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
            const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
            let comparison = 0;
            if (varA > varB) comparison = 1;
            else if (varA < varB) comparison = -1;
            return ((order === 'desc') ? (comparison * -1) : comparison);
        };
    }

    findStringInQuery (opt: any, query: any, parm: string) {
        for (var i = 0; i < 2; i++) {
            if (opt.points !== 0) continue;
            //Groß -u. Klein unverändert
            var result: string | null = "";
            let treffer: any = "";
            let name = opt[parm];

            for (var b in query) {
                b = query[b];
                if (i === 0) treffer = name.indexOf(b);
                else treffer = name.toUpperCase().indexOf(b.toUpperCase());
                if (treffer !== -1) {
                    treffer++;
                    if (i === 0) result += name.slice(0, treffer).replace(b, b);
                    else result += name.slice(0, treffer).replace(new RegExp(b, 'i'), name[treffer - 1]);
                    name = name.slice(treffer, name.length);
                } else {
                    result = null;
                    break;
                }
            }
            if (result) {
                result += name;
                opt[parm] = result;
                opt.points = query.length;
                if (i === 0) opt.points *= 10;
                else opt.points *= 8;
            }
        }
        return opt;
    }


    generateList(query: any, inner: any, parm: any) {

        for (let paramInner in inner) {

            let opt = inner[paramInner];
            opt.points = 0;
            if (typeof opt[parm] !== "string") continue;
            /*
            ##########################################
             erste Buchstaben werden untersucht 1000 / 800 Punkte
            ##########################################
            */
            var querySlice = query;
            for (const i in query) {
                if (opt[parm].startsWith(querySlice)) {
                    opt.points += 1000 * querySlice.length;
                    opt[parm] = opt[parm].replace(querySlice, querySlice);
                    break;
                }
                if (querySlice.length <= query.length - this.toleranz) break;
                querySlice = querySlice.slice(0, -1);
                if (i === "") continue;
            }
            if (opt.points !== 0) continue;

            querySlice = query;
            //Bei kleiner Rechtschreibung
            for (const i in query) {
                if (opt[parm].toUpperCase().startsWith(querySlice.toUpperCase())) {
                    opt.points += 800 * querySlice.length;
                    var name = opt[parm].slice(0, querySlice.length) + opt[parm].slice(querySlice.length, opt[parm].length);
                    opt[parm] = name;
                    break;
                }
                if (querySlice.length <= query.length - this.toleranz) break;
                querySlice = querySlice.slice(0, -1);
                if (i === "") continue;
            }
            if (opt.points !== 0) continue;

            /*
            ##########################################
             Treffer bei der Suche im Wort 100 / 80
            ##########################################
            */
            //Groß -u. Klein unverändert
            if (opt[parm].indexOf(query) !== -1 && query.length !== 0) {
                opt[parm] = opt[parm].replace(query, query);
                opt.points = query.length * 100;
            }
            if (opt.points !== 0) continue;

            //Groß -u. Klein nicht beachtet
            var upQuery = opt[parm].toUpperCase().indexOf(query.toUpperCase());
            if (upQuery !== -1 && query.length !== 0) {
                var frontname = opt[parm].slice(0, upQuery);
                var middlename = opt[parm].slice(upQuery, upQuery + query.length);
                var backename = opt[parm].slice(upQuery + query.length, opt[parm].length);

                opt[parm] = frontname + middlename + backename;

                opt[parm] = opt[parm].replace(query, query);
                opt.points = query.length * 80;
            }
            if (opt.points !== 0) continue;

        }
        return inner;

    }
}()