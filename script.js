let vm = null;
const debounce = function debounce(fn, delay) {
    // return fn.apply(that, args);
    const isBrowser =
        typeof window !== "undefined" && typeof document !== "undefined";
    const longerTimeoutBrowsers = ["Edge", "Trident", "Firefox"];

    supportsMicroTasks = isBrowser && window.Promise
        // console.log(supportsMicroTasks);
    let timeoutDuration = 0;
    for (let i = 0; i < longerTimeoutBrowsers.length; i += 1) {
        if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
            timeoutDuration = 100;
            break;
        }
    }
    if (supportsMicroTasks) {
        let called = false;
        return () => {
            if (called) {
                return;
            }
            called = true;
            window.Promise.resolve().then(() => {
                called = false;
                fn();
            });
        };

    } else {
        let scheduled = false;
        return () => {
            if (!scheduled) {
                scheduled = true;
                setTimeout(() => {
                    scheduled = false;
                    fn();
                }, timeoutDuration);
            }
        }
    }

    // var timeoutID = null
    // return function() {
    //     clearTimeout(timeoutID)
    //     var args = arguments
    //     var that = this
    //     timeoutID = setTimeout(function() {
    //         fn.apply(that, args)
    //     }, delay)
    // }
}

Vue.component('table-column', {
        template: `<div v-if="false">
            <slot :name="prop"></slot>
          </div>`,
        props: {
            label: String,
            prop: String,
            width: [Number, String],
            type: String,
            sortable: {
                type: Boolean,
                default: false
            },
            fixed: {
                type: String,
                default: '' // left/right
            },
            align: {
                type: String,
                default: 'center',
                validator: (val) => ['left', 'center', 'right'].indexOf(val) > -1
            },
            filter: {
                type: Boolean,
                default: false,
            },
            renderHeader: [Function],
            renderCell: [Function],
            colspan: [Number, String],
            rowspan: [Number, String],
        }
    })
    //module.exports = directive
Vue.component('Dropdown', {
    template: `<div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" :id="buttonId" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" :class="statuts?'aaa':'vvv'" v-on:click="statuts = !statuts" >
      {{ current }}
    </button>
    <div class="dropdown-menu" :aria-labelledby="buttonId" v-if="statuts">
      <a class="dropdown-item" v-for="item in items" :key="item" href="#" v-on:click="select(item, $event)">
        {{ item }}
      </a>
    </div>
  </div>`,
    props: {
        items: Array,
        current: Number,
    },
    data() {
        return {
            buttonId: 'dropdownMenuButton-' + this._uid,
            statuts: false
        }
    },
    methods: {
        select(item, event) {
            event.preventDefault();
            this.statuts = !this.statuts
            this.$emit('select', item)
        }
    }
})
Vue.component('PaginatorItem', {
    template: `
  <li v-bind:class="['page-item', { 'disabled': disabled === true }, { 'active': active === true }]">
    <a class="page-link" href="#" v-on:click="click">
      <slot></slot>
    </a>
  </li>`,
    props: {
        active: Boolean,
        disabled: Boolean,
    },
    methods: {
        click(event) {
            event.preventDefault();
            this.$emit('click')
        }
    },
})
Vue.component('Paginator', {
    template: `
    <nav>
    <ul class="pagination justify-content-center">
      <paginator-item :disabled="current <= 0" v-on:click="first">
        <i class="fas fa-angle-double-left"></i>
      </paginator-item>
      <paginator-item :disabled="current <= 0" v-on:click="decrease">
        <i class="fas fa-angle-left"></i>
      </paginator-item>
      <paginator-item v-for="(item, index) in items" :key="index" :active="item === current" v-on:click="select(item)">
        {{ item + 1 }}
      </paginator-item>
      <paginator-item :disabled="current >= total - 1" v-on:click="increase">
        <i class="fas fa-angle-right"></i>
      </paginator-item>
      <paginator-item :disabled="current >= total - 1" v-on:click="last">
        <i class="fas fa-angle-double-right"></i>
      </paginator-item>
    </ul>
  </nav>
    `,
    components: {
        /* 'paginator-item': PaginatorItem */
    },
    props: {
        total: Number,
        current: Number
    },
    data() {
        return {
            chunkSize: 10
        }
    },
    computed: {
        totalChunks() {
            return Math.ceil(this.total / this.chunkSize)
        },
        currentChunk() {
            return Math.floor(this.current / this.chunkSize)
        },
        items() {
            const first = this.currentChunk * this.chunkSize
            const len = (first + this.chunkSize) > this.total ? this.total - first : this.chunkSize
            return Array(len).fill(0).map((e, i) => first + i)
        }
    },
    methods: {
        select(item) {
            if (item === this.current) return
            this.$emit('select', item)
        },
        increase() {
            this.$emit('select', this.current + 1)
        },
        decrease() {
            this.$emit('select', this.current - 1)
        },
        first() {
            this.$emit('select', 0)
        },
        last() {
            this.$emit('select', this.total - 1)
        }
    }
})
Vue.component('vue2-simple-datatable', {
    template: `
    <div class="vue2-simple-datatable">
      <div v-if="config.limits || config.exportButton" class="row mb-2">
        <div class="col-lg-12">
          <dropdown v-if="config.limits" class="float-right ml-2" :items="config.limits" :current="config.limit" v-on:select="setLimit" v-if="this.paging">
          </dropdown>
          <button v-if="config.exportButton" class="btn btn-secondary float-right" type="button" v-on:click="exportData">
            <i class="fas fa-file-download"></i>
            <span v-if="i18n.export && i18n.export.length > 0" class="ml-1">
              {{ i18n.export }}
            </span>
          </button>
          </div>
      </div>
      <div class="tablewrapper">
        <div v-for="(position, index) in positionTable" :key="index" :class="(position == '' ? 'normal' : ('table'+position))" :style="fixTableSize(position)">
          <table class="table table-striped scrolling" :ref="'table'+position" :class="{ scrolly: scrollVertical, scrollx: scrollHorizontal }" :style="position=='' ? tableStyle :''">
              <thead :ref="'thead'+position" :class="{ scrollsync: syncHeaderScroll }" :style="(position=='' && syncHeaderScroll && scrollVertical) ? stubScrollbarStyle : '' " @dragenter="onDragEnterHeader" @dragover.prevent="onDragOverHeader" @drop="onDropHeader" >
                  <slot :name="'theaderbefore' + position">
                  </slot>
                  <tr>
                    <th v-for="(column, index) in columnsTemp[position]" :key="index" :colspan="column.propsData.colspan" :rowspan="column.propsData.rowspan" :style="{height: colFilterHeight + 'px'}" >
                        <a class="text-dark btn" href="#" v-on:click="sortBy(column.propsData.prop, $event)" v-if="column.propsData.sortable">
                          {{renderHeader(column, index)}}
                          <i v-bind:class="sortIconClasses(column)"></i>
                        </a>
                        <template v-else>
                          {{renderHeader(column, index)}}
                        </template>
                    </th>
                  </tr>
                  <slot :name="'theaderafter' + position">
                  </slot>
                  <tr v-if="openfiltter" class="filter">
                    <th v-for="(column, index) in columnsTemp[position]" :key="index" scope="col" :style="{height: colFilterHeight + 'px'}" >
                      <div class="input-group" v-if="column.propsData.filter">
                          <input type="text" class="form-control" v-model.lazy="search[column.propsData.prop]" v-debounce="500" v-bind:placeholder="filterByText(column.propsData.prop)">
                      </div>
                    </th>
                  </tr>
              </thead>
              <tbody :ref="'tbody'+position">
                  <tr v-for="(row, index) in rows" :key="index">
                      <td v-for="(column, index) in columnsTemp[position]" :key="column+index" :style="{height: colHeight + 'px'}" >
                          <slot :name="column.propsData.prop" :value="row[column.propsData.prop]">
                              {{ renderCell(column, row, index) }}
                          </slot>
                      </td>
                  </tr>
              </tbody>
          </table>
        </div>
      </div>
      <paginator :total="totalPages" :current="currentPage" v-on:select="selectPage" v-if="this.paging"></paginator>
      <p class="small text-center" v-if="this.paging">{{ countText }}</p>
  </div>
    `,
    components: {
        /* 'paginator': Paginator,
        'dropdown': Dropdown */
    },
    directives: {
        debounce
    },
    props: {
        data: {
            type: Array,
            default: []
        },
        columns: {
            type: Array,
            default: []
        },
        initialSearch: Object,
        deadAreaColor: { type: String, required: false, default: "#CCC" },
        includeFooter: { type: Boolean, required: false, default: false },
        syncHeaderScroll: { type: Boolean, required: false, default: true },
        syncFooterScroll: { type: Boolean, required: false, default: true },
        scrollHorizontal: { type: Boolean, required: false, default: true },
        scrollVertical: { type: Boolean, required: false, default: true },
        colHeight: {
            type: [Number, String],
            default: 40
        },
        paging: false,
    },
    data() {
        return {
            currentPage: 0,
            sort: undefined,
            ascending: true, // false = descending
            search: this.initialSearch,
            config: {
                limit: 10,
                limits: [10, 25, 50, 100],
                regexSearch: false,
                exportButton: false
            },
            i18n: {
                countPagedN: 'Showing {from} to {to} of {count} records',
                countN: '{count} records',
                count1: 'One record',
                count0: 'No records',
                filterBy: 'Filter by {column}',
                export: 'Export'
            },
            columnsTemp: [],
            leftColumnsTemp: [],
            rightColumnsTemp: [],
            selectionColumnTemp: [],
            scrollType: "",
            scrollTop: 0,
            self: {},
            positionTable: ['left', '', 'right'], //''=>normal
            openfiltter: false,
            colFilterHeight: 0,
            tableFixHeight: 0,
            tableFixWidth: 0,
            scrollWidth: 0,
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.total / this.config.limit)
        },
        searchFuncs() {
            const keys = Object.keys(this.search)
            let result = {}
            keys.forEach(key => {
                const searchString = this.search[key]
                if (!searchString) return
                result[key] = this.createSearcFuncs(searchString)
            });
            return result
        },
        filteredData() {
            const search = this.searchFuncs
            const searchedCols = Object.keys(search)
            const colMatch = (row, colName) => {
                const colVal = row[colName]
                return search[colName](colVal)
            }
            const rowMatch = (row) => (!searchedCols.some(col => !colMatch(row, col)))
            return this.data.filter(row => rowMatch(row))
        },
        filteredAndSortedData() {
            const rows = this.filteredData
            if (this.sort) {
                const col = this.sort
                if (this.ascending) {
                    rows.sort((a, b) => (a[col] > b[col]) - (a[col] < b[col]))
                } else {
                    rows.sort((b, a) => (a[col] > b[col]) - (a[col] < b[col]))
                }
            }
            return rows
        },
        rows() {
            const all = this.filteredAndSortedData
            return this.paging ? all.slice(this.offset, this.offset + this.config.limit) : all
        },
        total() {
            return this.filteredData.length
        },
        offset() {
            return this.config.limit * this.currentPage
        },
        countText() {
            if (this.totalPages === 1) {
                if (this.total === 0) return this.i18n.count0
                if (this.total === 1) return this.i18n.count1
                return this.i18n.countN.replace('{count}', this.total)
            }
            return this.i18n.countPagedN.replace('{from}', this.offset + 1)
                .replace('{to}', this.offset + this.config.limit)
                .replace('{count}', this.total)
        },
        tableStyle() {
            return `background-color: ${this.deadAreaColor};`
        },
        stubScrollbarStyle() {
            return `background-color: ${this.deadAreaColor};
          scrollbar-base-color: ${this.deadAreaColor};
          scrollbar-face-color: ${this.deadAreaColor};
          scrollbar-highlight-color: ${this.deadAreaColor};
          scrollbar-track-color: ${this.deadAreaColor};
          scrollbar-arrow-color: ${this.deadAreaColor};
          scrollbar-shadow-color: ${this.deadAreaColor};
          scrollbar-darkshadow-color: ${this.deadAreaColor};`
        },
    },
    watch: {
        data: {
            handler() {
                this.resetState()
            },
            deep: true
        },
        columns: {
            handler() {
                this.resetState()
            },
            deep: true
        },
        initialSearch: {
            handler(newVal) {
                this.search = Object.assign({}, newVal)
            },
            deep: true,
            immediate: true
        },
        filteredData() {
            this.currentPage = 0
        },
        deadAreaColor() {
            this.setColors()
        },
        scrollTop: {
            handler(newVal) {
                // console.log(newVal);
                debounce(this.updateOtherSyncedScroll(newVal), 0);
            },
            deep: true,
        },
    },
    methods: {
        fixTableSize(position) {
            let height = (position != '' && this.tableFixHeight > 0 ? (this.tableFixHeight + 'px') : '');
            let width = (position != '' && this.tableFixWidth > 0 ? (this.tableFixWidth + 'px') : '');
            let style = {
                height: height,
                width: width,
            }
            if (position == 'right') {
                style['right'] = (this.scrollWidth - 1) + 'px';
            }
            return style

        },
        resetState() {
            const initialData = this.$options.data()
            this.currentPage = initialData.currentPage
            this.sort = initialData.sort
            this.ascending = initialData.ascending
            this.search = Object.assign({}, this.initialSearch)
        },
        selectPage(page) {
            this.currentPage = page
        },
        sortBy(column, event) {
            event.preventDefault()
            if (this.sort === column) {
                this.ascending = !this.ascending
            } else {
                this.sort = column
                this.ascending = true
            }
        },
        setLimit(limit) {
            this.currentPage = 0
            this.config.limit = limit
        },
        sortIconClasses(column) {
            if (this.sort !== column) return ['fas', 'fa-sort']
            if (this.ascending === true) return ['fas', 'fa-sort-up']
            return ['fas', 'fa-sort-down']
        },
        filterByText(column) {
            return this.i18n.filterBy.replace('{column}', column)
        },
        createSearcFuncs(search) {
            const val = search.toLowerCase()
            if (this.config.regexSearch === true) {
                const regex = new RegExp(val, 'g')
                return (input) => (input ? input.toString().toLowerCase().match(regex) : false)
            } else {
                return (input) => (input ? input.toString().toLowerCase().includes(val) : false)
            }
        },
        exportData() {
            this.$emit('export', this.filteredAndSortedData)
        },
        setColors() {
            const s = this.$refs.table.style
            if (typeof s != 'undefined')
                s.setProperty("--dead-area-color", this.deadAreaColor)
        },
        onDragEnterHeader(e) {
            this.$emit("header-dragenter", e)
        },
        onDragOverHeader(e) {
            this.$emit("header-dragover", e)
        },
        onDropHeader(e) {
            this.$emit("header-drop", e)
        },
        updateColumnsWidth(columns = undefined) {
            const MIN_WIDTH = 90;
            let allColumns = [];
            let flexColumnIndexs = [];
            let bodyMinWidth = 0;
            console.log(this.$slots.default);
            if (!columns) {
                allColumns = this.$slots.default
                    .filter(column => column.componentOptions && column.componentOptions.tag === 'table-column')
                    .map(column => column.componentOptions);
            } else {
                allColumns = [].concat(columns);
            }

            if (!this.flexColumnIndexs) {
                // 未指定 width 属性的弹性列
                flexColumnIndexs = allColumns.map((col, index) => {
                    if (this.isValidNumber(col.width)) {
                        return index;
                    }
                    return -1;
                }).filter(val => val !== -1);
                this.flexColumnIndexs = [].concat(flexColumnIndexs);
            } else {
                flexColumnIndexs = [].concat(this.flexColumnIndexs);
            }
            if (!this.bodyMinWidth) {
                allColumns.forEach(col => {
                    let colWidth = MIN_WIDTH;
                    if (!this.isValidNumber(col.width)) {
                        colWidth = parseInt(col.width, 10);
                        col.$realWidth = colWidth;
                    }
                    bodyMinWidth += colWidth;
                });
                this.bodyMinWidth = bodyMinWidth;
            } else {
                bodyMinWidth = this.bodyMinWidth;
            }
            if (flexColumnIndexs.length) {
                if (bodyMinWidth <= this.containerWidth) {
                    const totalFlexWidth = this.containerWidth - bodyMinWidth;
                    if (flexColumnIndexs.length === 1) {
                        allColumns[flexColumnIndexs[0]].$realWidth = MIN_WIDTH + totalFlexWidth;
                    } else {
                        const allColumnsWidth = flexColumnIndexs.length * MIN_WIDTH;
                        const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
                        let noneFirstWidth = 0;
                        flexColumnIndexs.forEach((col, index) => {
                            if (index === 0) {
                                return;
                            }
                            const flexWidth = Math.floor(MIN_WIDTH * flexWidthPerPixel);
                            noneFirstWidth += flexWidth;
                            allColumns[flexColumnIndexs[index]].$realWidth = MIN_WIDTH + flexWidth;
                        });
                        allColumns[flexColumnIndexs[0]].$realWidth = MIN_WIDTH + totalFlexWidth - noneFirstWidth;
                    }
                } else {
                    flexColumnIndexs.forEach((col, index) => {
                        allColumns[flexColumnIndexs[index]].$realWidth = MIN_WIDTH;
                    });
                }
            }
            this.bodyWidth = Math.max(bodyMinWidth, this.containerWidth);
            return allColumns;
        },
        getColumnComponentsByType(columns, type) {
            let cols = [];

            switch (type) {
                case 'selection':
                    cols = columns.filter(column => {
                        return column.propsData.type === 'selection';
                    });
                    cols = cols.length > 1 ? [cols[0]] : cols;
                    break;
                case 'left':
                    cols = columns.filter(column => {
                        return (column.propsData.fixed === 'left' && column.propsData.type !== 'selection')
                    });
                    break;
                case 'right':
                    cols = columns.filter(column => {
                        return (column.propsData.fixed === 'right' && column.propsData.type !== 'selection')
                    });
                    break;
                default:
                    cols = columns.filter(column => {
                        return !['left', 'right'].includes(column.propsData.fixed) && column.propsData.type !== 'selection';
                    });
                    break;
            }
            return cols;
        },
        renderHeader(column, index) {
            let _column = column.propsData;
            return typeof column.propsData.renderHeader === "function" ?
                column.propsData.renderHeader.call(self._renderProxy, vm, {
                    "column": _column,
                    index
                }) :
                column.propsData.label
        },
        renderCell(column, row, index) {
            let _column = column.propsData.prop;
            return typeof column.propsData.renderCell === "function" ?
                column.propsData.renderCell.call(self._renderProxy, vm, {
                    "column": _column,
                    row,
                    index
                }) : row[column.propsData.prop]

        },
        isValidNumber(number) {
            return isNaN(parseInt(number, 10));
        },
        matchHeightCell() {
            let that = this;
            if (typeof this.colHeight == 'undefined' || this.colHeight == 0) {
                let height = 0;
                let elements = this.$refs.tbody[0].getElementsByTagName('tr');
                for (var index in elements) {
                    if (!this.isValidNumber(index) && elements[index].offsetHeight > that.height) {
                        that.height = elements[index].offsetHeight;
                    }
                }
                this.colHeight = height;
            }
            if ((this.openfiltter) && (typeof this.colFilterHeight == 'undefined' || this.colFilterHeight == 0)) {
                let elements = this.$refs.thead[0].getElementsByTagName('tr');
                for (var index in elements) {
                    if (!this.isValidNumber(index) && elements[index].offsetHeight > that.colFilterHeight) {
                        that.colFilterHeight = elements[index].offsetHeight;
                    }
                }
            }
            if (typeof this.colHeight == 'undefined' || this.colFilterHeight == 0) {
                this.colFilterHeight = this.colHeight;
            }
            console.log(this.colHeight);
        },
        scrollCalculate() {
            let fix = this.$refs.tbodyleft[0].clientHeight;
            if (fix <= 0) {
                fix = this.$refs.tbodyright[0].clientHeight;
            }
            let normal = this.$refs.tbody[0].clientHeight;
            this.tableFixHeight = this.$refs.table[0].clientHeight - (fix - normal);
            this.scrollWidth = this.$refs.table[0].children[0].offsetWidth - this.$refs.table[0].children[0].clientWidth;
            if (fix <= 0) {
                this.tableFixWidth = this.$refs.tbodyright[0].getElementsByTagName('tr')[0].offsetWidth;
            } else {
                this.tableFixWidth = this.$refs.tbodyleft[0].getElementsByTagName('tr')[0].offsetWidth;
            }
        },

        updateSyncedScroll(v) {
            // let v = this.scrollType
            const b = this.$refs[v][0];
            const l = b.scrollLeft
            if (this.scrollHorizontal) {
                if (this.syncHeaderScroll) {
                    const h = this.$refs['thead'][0]
                    if (h.scrollLeft !== l) {
                        h.scrollLeft = l
                    }
                }
                if (this.includeFooter && this.syncFooterScroll) {
                    const f = this.$refs['tfoot'][0]
                    if (f.scrollLeft !== l) {
                        f.scrollLeft = l
                    }
                }
            }
            let trSize = b.getElementsByTagName('tr')[0].offsetHeight;
            let tbodySize = b.scrollHeight;
            let lastPos = tbodySize - trSize
            const scrollTop = b.scrollTop;
            // b.scrollTop = 0;
            if (scrollTop < this.scrollTop && trSize <= scrollTop) {
                this.scrollTop = scrollTop - trSize;
            } else if (scrollTop > this.scrollTop && scrollTop > lastPos) {
                this.scrollTop = tbodySize;
            } else
                this.scrollTop = scrollTop;
            // debounce(this.updateOtherSyncedScroll(b), 100000);
            return b;
        },
        updateOtherSyncedScroll(b) {
            let v = this.scrollType
            let that = this;
            (that.$refs['tbody'][0]).scrollTop = b;
            (that.$refs['tbodyleft'][0]).scrollTop = b;
            (that.$refs['tbodyright'][0]).scrollTop = b;
            // if (v == 'tbody') {
            //     that.positionTable.forEach(function(p, i) {
            //         p = 'tbody' + p;
            //         if (p != v) {
            //             (that.$refs[p][0]).scrollTop = b; //that.scrollTop;
            //             console.log(p + "===>>" + (that.$refs[p][0]).scrollTop);
            //         }
            //     });
            // }
        }
    },
    beforeDestroy() {
        let that = this;
        this.positionTable.forEach(function(v, i) {
            v = 'tbody' + v;
            that.$refs[v].removeEventListener('scroll', (e) => {
                if (that.scrollType == v) {
                    let b = that.updateSyncedScroll();
                    if (b.scrollTop !== that.scrollTop)
                        debounce(that.updateOtherSyncedScroll(b), 100);
                }
                that.scrollType = v;
            });
        });
    },
    mounted: function() {
        this.self = this;
        this.setColors()
        this.containerWidth = this.$el.clientWidth;
        this.containerHeight = this.$el.clientHeight;
        const columnComponents = this.updateColumnsWidth();
        const selectionColumnComponents = this.getColumnComponentsByType(columnComponents, 'selection');
        const normalColumnComponents = this.getColumnComponentsByType(columnComponents, 'normal');
        const fixedLeftColumnComponents = this.getColumnComponentsByType(columnComponents, 'left');
        const fixedRightColumnComponents = this.getColumnComponentsByType(columnComponents, 'right');
        const selectPosition = selectionColumnComponents[0].propsData.fixed
        this.columnsTemp = {
            '': [].concat(fixedLeftColumnComponents, ((selectPosition != 'left' && selectPosition != 'right') ? selectionColumnComponents : []), normalColumnComponents, fixedRightColumnComponents),
            // '': [].concat(((selectPosition != 'left' && selectPosition != 'right') ? selectionColumnComponents : []), normalColumnComponents),
            left: [].concat((selectPosition == 'left' ? selectionColumnComponents : []), fixedLeftColumnComponents),
            right: [].concat(fixedRightColumnComponents, (selectPosition == 'right' ? selectionColumnComponents : [])),
        };
        let that = this;
        that.openfiltter = this.columnsTemp[''].filter(column => {
            return (!that.openfiltter && column.propsData.filter);
        }).length > 0;
        // this.positionTable.forEach(function(v, i) {
        //     v = 'tbody' + v;
        //     (that.$refs[v][0]).addEventListener('scroll', (e) => {
        //         if (that.scrollType == v) {
        //             that.updateSyncedScroll();
        //             // debounce(that.updateSyncedScroll(), 10000);
        //         }
        //         that.scrollType = v;
        //     }, false);
        // });
        //if using for speed slow then using split
        (that.$refs['tbody'][0]).addEventListener('scroll', (e) => {
            that.updateSyncedScroll('tbody');
        }, false);
        (that.$refs['tbodyleft'][0]).addEventListener('scroll', (e) => {
            that.updateSyncedScroll('tbodyleft');
        }, false);
        (that.$refs['tbodyright'][0]).addEventListener('scroll', (e) => {
            that.updateSyncedScroll('tbodyright');
        }, false);

        this.$nextTick(() => {
            this.matchHeightCell();
            this.scrollCalculate();
        });
    },
});

vm = new Vue({
    el: "#app",
    data: {
        data: [],
        columns: ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'k'],
        // optional:
        initialSearch: {
            b: 'y'
        }
    },
    mounted() {
        for (var i = 4; i < 100; i++) {
            this.data.push({
                id: i,
                a: i,
                b: i + 'ZZ',
                c: i,
                d: i + 'ZZ',
                e: i,
                f: i + 'ZZ',
                g: i,
                h: i + 'ZZ',
                i: i + 'ZZ',
                k: i + 'ZZ',
            })
        }
    },
    methods: {

        exportHandler(data) {
            console.log(data);
        }
    }
})