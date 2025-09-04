/**
 * Table组件 - 根据JSON数据渲染表格
 * 使用方法：
 * const tableInstance = new Table(containerElement);
 * tableInstance.render({
 *   columns: [...], // 列配置
 *   dataSource: [...], // 数据源
 *   pagination: true, // 是否分页
 *   pageSize: 10, // 每页条数
 *   title: '表格标题', // 表格标题
 *   size: 'middle' // 表格大小：small, middle, default
 * });
 */

/**
 * Table类 - 表格渲染组件
 */
class Table {
    /**
     * 构造函数
     * @param {HTMLElement} container - 表格容器元素
     */
    constructor(container) {
        this.container = container;
        this.pagination = true;
        this.pageSize = 10;
        this.current = 1;
        this.total = 0;
        this.dataSource = [];
        this.columns = [];
        this.size = 'default';
        this.title = '';
    }

    /**
     * 渲染表格
     * @param {Object} options - 表格配置选项
     * @param {Array} options.columns - 列配置
     * @param {Array} options.dataSource - 数据源
     * @param {boolean} [options.pagination=true] - 是否启用分页
     * @param {number} [options.pageSize=10] - 每页显示条数
     * @param {string} [options.size='default'] - 表格大小：small, middle, default
     * @param {string} [options.title=''] - 表格标题
     */
    render(options = {}) {
        if (!this.container) return;

        // 设置表格属性
        this.columns = options.columns || [];
        this.dataSource = options.dataSource || [];
        this.pagination = options.pagination !== false;
        this.pageSize = options.pageSize || 10;
        this.size = options.size || 'default';
        this.title = options.title || '';
        this.total = this.dataSource.length;

        // 渲染表格
        const tableHtml = this.generateTableHtml();
        this.container.innerHTML = tableHtml;
        
        // 绑定分页事件
        if (this.pagination) {
            this.bindPaginationEvents();
        }
        
        // 确保表格可滚动，特别是在移动设备上
        this.ensureTableScrollable();
    }
    
    /**
     * 确保表格可滚动
     * 在移动设备上特别重要
     */
    ensureTableScrollable() {
        // 添加最外层容器类以确保滚动
        this.container.classList.add('table-container');
        
        // 获取表格容器元素
        const tableWrapper = this.container.querySelector('.ant-table-wrapper');
        
        if (tableWrapper) {
            // 移除内部元素的滚动设置，避免多重滚动条
            tableWrapper.style.overflow = 'visible';
            tableWrapper.style.width = '100%';
        }
        
        // 获取所有内部滚动容器并移除其滚动设置
        const innerScrollContainers = this.container.querySelectorAll('.table-scroll-container, .ant-table-container, .ant-table-content');
        innerScrollContainers.forEach(container => {
            if (container) {
                container.style.overflow = 'visible';
                container.style.width = '100%';
            }
        });
        
        // 检查是否是移动设备
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            const table = this.container.querySelector('table');
            if (table) {
                table.style.minWidth = '650px';
            }
        }
    }

    /**
     * 生成表格HTML
     * @returns {string} 表格HTML字符串
     */
    generateTableHtml() {
        // 设置表格大小样式
        const sizeClass = this.size === 'small' ? 'ant-table-small' : 
                         this.size === 'middle' ? 'ant-table-middle' : '';

        return `
            <div class="ant-table-wrapper">
                ${this.title ? `<div class="ant-table-title">${this.title}</div>` : ''}
                <div class="ant-spin-nested-loading">
                    <div class="ant-spin-container">
                        <div class="ant-table ${sizeClass}">
                            <div class="ant-table-container">
                                <div class="ant-table-content">
                                    <table style="min-width: 100%;">
                                        <thead class="ant-table-thead">
                                            <tr>
                                                ${this.columns.map(col => 
                                                    `<th class="ant-table-cell">${col.title}</th>`
                                                ).join('')}
                                            </tr>
                                        </thead>
                                        <tbody class="ant-table-tbody">
                                            ${this.renderTableRows()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        ${this.pagination ? this.renderPagination() : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 渲染表格行
     * @returns {string} 表格行HTML
     */
    renderTableRows() {
        // 处理空数据情况
        if (this.dataSource.length === 0) {
            return `
                <tr class="ant-table-placeholder">
                    <td class="ant-table-cell" colspan="${this.columns.length}">
                        <div class="ant-empty ant-empty-normal">
                            <div class="ant-empty-image">
                                <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                                        <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
                                        <g fill-rule="nonzero" stroke="#D9D9D9">
                                            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                            <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA"></path>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div class="ant-empty-description">暂无数据</div>
                        </div>
                    </td>
                </tr>
            `;
        }

        // 处理分页
        const startIndex = this.pagination ? (this.current - 1) * this.pageSize : 0;
        const endIndex = this.pagination ? startIndex + this.pageSize : this.dataSource.length;
        const currentData = this.dataSource.slice(startIndex, endIndex);

        // 生成行HTML
        return currentData.map((row, index) => `
            <tr class="ant-table-row ant-table-row-level-0" data-row-key="${row.key || index}">
                ${this.columns.map(col => `
                    <td class="ant-table-cell">${this.renderCellValue(row, col)}</td>
                `).join('')}
            </tr>
        `).join('');
    }

    /**
     * 渲染单元格值，支持特殊字段样式
     * @param {Object} row - 行数据
     * @param {Object} column - 列配置
     * @returns {string} 单元格HTML
     */
    renderCellValue(row, column) {
        const value = row[column.dataIndex];
        
        // 特殊字段样式处理
        if (column.dataIndex === 'status') {
            const statusClass = value === '正常' ? 'ant-tag-green' : 'ant-tag-red';
            return `<span class="ant-tag ${statusClass}">${value}</span>`;
        }
        
        if (column.dataIndex === 'method') {
            const methodClass = {
                'GET': 'ant-tag-blue',
                'POST': 'ant-tag-green',
                'PUT': 'ant-tag-orange',
                'DELETE': 'ant-tag-red'
            }[value] || 'ant-tag';
            return `<span class="ant-tag ${methodClass}">${value}</span>`;
        }

        if (column.dataIndex === 'change') {
            if (!value) return '-';
            const isPositive = value.startsWith('+');
            const changeClass = isPositive ? 'text-success' : 'text-danger';
            return `<span class="${changeClass}">${value}</span>`;
        }

        // 默认渲染
        return value || '-';
    }

    /**
     * 渲染分页组件
     * @returns {string} 分页HTML
     */
    renderPagination() {
        // 如果不需要分页或数据量小于一页，不显示分页
        if (!this.pagination || this.total <= this.pageSize) {
            return '';
        }

        const totalPages = Math.ceil(this.total / this.pageSize);

        return `
            <ul class="ant-pagination ant-table-pagination ant-table-pagination-right">
                <li class="ant-pagination-total-text">共 ${this.total} 条</li>
                <li class="ant-pagination-prev ${this.current === 1 ? 'ant-pagination-disabled' : ''}" 
                    data-page="${this.current - 1}">
                    <button class="ant-pagination-item-link" ${this.current === 1 ? 'disabled' : ''}>
                        <span role="img" aria-label="left" class="anticon anticon-left">
                            <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em">
                                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.2 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                            </svg>
                        </span>
                    </button>
                </li>
                ${this.renderPageNumbers(totalPages)}
                <li class="ant-pagination-next ${this.current === totalPages ? 'ant-pagination-disabled' : ''}" 
                    data-page="${this.current + 1}">
                    <button class="ant-pagination-item-link" ${this.current === totalPages ? 'disabled' : ''}>
                        <span role="img" aria-label="right" class="anticon anticon-right">
                            <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em">
                                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.8 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.86 31.86 0 000-50.3z"></path>
                            </svg>
                        </span>
                    </button>
                </li>
                <li class="ant-pagination-options">
                    <div class="ant-pagination-options-size-changer">
                        <span class="ant-select-selection-item">${this.pageSize} 条/页</span>
                    </div>
                </li>
            </ul>
        `;
    }

    /**
     * 渲染页码
     * @param {number} totalPages - 总页数
     * @returns {string} 页码HTML
     */
    renderPageNumbers(totalPages) {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, this.current - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <li class="ant-pagination-item ${i === this.current ? 'ant-pagination-item-active' : ''}" 
                    data-page="${i}">
                    <a>${i}</a>
                </li>
            `);
        }

        return pages.join('');
    }

    /**
     * 绑定分页事件处理
     */
    bindPaginationEvents() {
        const pagination = this.container.querySelector('.ant-pagination');
        if (!pagination) return;

        pagination.addEventListener('click', (e) => {
            e.preventDefault();
            const pageItem = e.target.closest('[data-page]');
            if (!pageItem) return;

            const page = parseInt(pageItem.getAttribute('data-page'));
            const totalPages = Math.ceil(this.total / this.pageSize);

            if (page >= 1 && page <= totalPages && page !== this.current) {
                this.current = page;
                this.render({
                    columns: this.columns,
                    dataSource: this.dataSource,
                    pagination: this.pagination,
                    pageSize: this.pageSize,
                    size: this.size,
                    title: this.title
                });
            }
        });
    }

    /**
     * 更新表格数据
     * @param {Array} dataSource - 新的数据源
     */
    updateData(dataSource) {
        this.dataSource = dataSource || [];
        this.total = this.dataSource.length;
        this.current = 1; // 重置到第一页
        this.render({
            columns: this.columns,
            dataSource: this.dataSource,
            pagination: this.pagination,
            pageSize: this.pageSize,
            size: this.size,
            title: this.title
        });
    }
}

// 导出到全局
window.Table = Table;
