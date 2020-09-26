# vue-scroll-table
vue scroll, filter, paging,... table created 

### Config & i18n

``` js
const config = {
    limit: 25,             // initial rows per page limit (default: 10)

    limits: [25, 50, 100], // rows per page limit options, or 'undefined' to
                           // hide dropdown (default: [10, 25, 50, 100])

    regexSearch: true,     // enable regex in search (default: false)
    exportButton: true     // show export button (default: false)
}
const i18n = {
    countPagedN: '{from} bis {to} von {count}', // default: 'Showing {from} to {to} of {count} records'
    countN: '{count} Einträge',                 // default: '{count} records'
    count1: '1 Eintrag',                        // default: 'One record'
    count0: 'Keine Einträge',                   // default: 'No records'
    filterBy: 'Suche nach \'{column}\'',        // default: 'Filter by {column}'
    export: 'Download'                          // default: 'Export'
}
```
### Table Slot

|  Name  |  Description  |
|  :--:  |  :--:  |
| empty | custom empty component, it's will show when data is empty |
| loading | custom loading component, it's will show when `loading` property of table is true 
| theaderbefore | custom html on thead and before row label 
| theaderbeforeleft | custom html on thead fix left and before row label 
| theaderbeforeright | custom html on thead fix right and before row label 
| theaderafter | custom html on thead and after row label 
| theaderafterleft | custom html on thead and after row label 
| theaderafterright |custom html on thead and after row label 

### The v2-table-column component

|  Attribute  |  Type  |  Accepted Values  |  Default  |  Description  |
|  :--:  |  :--:  |  :--:  |  :--:  |  :--:  |
| label | String | - | - | column label |
| prop | String | - | - | field name |
| width | String/Number | - | - | column width |
| sortable | Boolean | true/false | false | whether column can be sorted. |
| align | String | left/center/right | center | alignment |
| fixed | String | left/right | - | fixed column to left or right |
| type | String | - | - | type of the column |
| render-header | Function(h, { column }) | - | - | render function for table header of this column |
| render-cell | Function(h, { column, row, index }) | - | - | render function for table cell of this column row |
| filter | Boolean | true/false | - filter value|
|colspan| Number/ String | - | colspan set| 
|rowspan| Number/ String | - | rowspan set|
