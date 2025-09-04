/**
 * 导航组件 - 根据JSON数据渲染导航菜单
 * 
 * 该组件用于生成网站导航菜单，支持自动从页面内容生成导航结构
 * 或者根据传入的JSON数据渲染导航
 */

// 帮助函数 - 检测设备是否为移动设备
function isMobile() {
    return window.innerWidth < 768;
}

// 响应式导航处理
function handleNavResize() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    sidebar.style.display = isMobile() ? 'none' : 'block';
}

/**
 * 导航组件类
 * 根据JSON数据或页面内容自动生成导航菜单
 */
class Navigation {
    /**
     * 创建导航组件实例
     * @param {HTMLElement} container - 导航容器元素
     * @param {Object} options - 配置选项
     * @param {Array} [options.navigationSections] - 导航数据，如果不提供则自动从页面内容生成
     * @param {Array} [options.selectedKeys=[]] - 选中的菜单项
     * @param {Array} [options.openKeys=[]] - 展开的菜单项
     * @param {Function} [options.onToggleSection] - 菜单展开/收起回调
     * @param {Function} [options.onScrollToSection] - 滚动到章节回调
     * @param {boolean} [options.autoGenerate=true] - 是否自动生成导航
     */
    constructor(container, options = {}) {
        this.container = container;
        this.navigationSections = options.navigationSections || [];
        this.selectedKeys = options.selectedKeys || [];
        this.openKeys = options.openKeys || [];
        this.onToggleSection = options.onToggleSection || (() => {});
        this.onScrollToSection = options.onScrollToSection || (() => {});
        this.autoGenerate = options.autoGenerate !== false; // 默认自动生成导航
    }

    /**
     * 从页面内容自动生成导航数据
     * @returns {Array} 导航数据结构
     */
    generateNavigationData() {
        const sections = [];
        
        // 只查找活动tab内的section元素
        const activeTabContent = document.querySelector('.tab-content.active');
        if (!activeTabContent) {
            console.warn('Navigation: 未找到活动的tab内容');
            return [];
        }
        
        const sectionElements = activeTabContent.querySelectorAll('.content-section');
        
        // 处理每个section元素
        let visibleSectionIndex = 0;
        sectionElements.forEach(section => {
            // 跳过隐藏的section
            const isVisible = section.offsetParent !== null || getComputedStyle(section).display !== 'none';
            if (!isVisible) return;
            
            // 确保section有标题和ID
            const h1Element = section.querySelector('.h1-title');
            if (!h1Element || !section.id) return;
            
            visibleSectionIndex++;
            const sectionNumber = visibleSectionIndex;
            
            // 获取原始标题文本，保持原有编号
            const originalTitle = h1Element.textContent.trim();
            
            // 创建section数据
            const sectionData = {
                key: section.id,
                title: originalTitle,
                children: []
            };
            
            // 获取有效的子标题元素（二级标题和三级标题）
            const allHeadings = Array.from(section.querySelectorAll('.h2-title, .h3-title')).filter(heading => {
                return !heading.closest('.section-content');
            }).sort((a, b) => {
                return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            });
            
            // 处理子标题
            let h2Counter = 0;
            let currentH2Data = null;
            
            allHeadings.forEach(heading => {
                if (heading.classList.contains('h2-title')) {
                    // 处理二级标题
                    h2Counter++;
                    const h2Id = heading.id || `${section.id}-h2-${h2Counter - 1}`;
                    if (!heading.id) heading.id = h2Id;
                    
                    const originalH2Title = heading.textContent.trim();
                    
                    currentH2Data = {
                        key: h2Id,
                        title: originalH2Title,
                        children: [],
                        h3Counter: 0
                    };
                    
                    sectionData.children.push(currentH2Data);
                    
                } else if (heading.classList.contains('h3-title') && currentH2Data) {
                    // 处理三级标题
                    currentH2Data.h3Counter++;
                    const h3Id = heading.id || `${currentH2Data.key}-h3-${currentH2Data.h3Counter - 1}`;
                    if (!heading.id) heading.id = h3Id;
                    
                    const originalH3Title = heading.textContent.trim();
                    
                    currentH2Data.children.push({
                        key: h3Id,
                        title: originalH3Title
                    });
                }
            });
            
            sections.push(sectionData);
        });
        
        return sections;
    }

    /**
     * 初始化导航
     */
    init() {
        if (this.autoGenerate) {
            // 延迟初始化以确保DOM加载完成
            setTimeout(() => {
                // 从页面内容自动生成导航数据
                this.navigationSections = this.generateNavigationData();
                
                // 设置默认选中第一个菜单项
                if (this.navigationSections.length > 0 && this.selectedKeys.length === 0) {
                    const firstKey = this.navigationSections[0].children.length > 0 
                        ? this.navigationSections[0].children[0].key 
                        : this.navigationSections[0].key;
                    this.selectedKeys = [`item-${firstKey}`];
                }
                
                // 默认展开所有一级菜单
                const defaultOpenKeys = this.navigationSections
                    .filter(section => section.children.length > 0)
                    .map(section => section.key);
                this.openKeys = defaultOpenKeys;
                
                this.render();
            }, 300);
        } else {
            this.render();
        }
    }

    /**
     * 渲染导航菜单
     */
    render() {
        if (!this.container) return;

        // 生成菜单HTML
        const menuHtml = this.renderMenu(this.navigationSections);
        this.container.innerHTML = menuHtml;
        
        // 移除之前的事件监听器（如果存在）
        if (this.clickHandler) {
            this.container.removeEventListener('click', this.clickHandler);
        }
        
        // 绑定事件
        this.bindEvents();
    }

    /**
     * 渲染整个菜单
     * @param {Array} sections - 导航数据
     * @returns {string} 菜单HTML
     */
    renderMenu(sections) {
        return `
            <div class="custom-menu">
                ${sections.map(section => this.renderMenuSection(section)).join('')}
            </div>
        `;
    }

    /**
     * 渲染一级菜单区域
     * @param {Object} section - 一级菜单数据
     * @returns {string} 菜单区域HTML
     */
    renderMenuSection(section) {
        const hasChildren = section.children && section.children.length > 0;
        const isOpen = this.openKeys.includes(section.key);
        const isSelected = this.selectedKeys.includes(`item-${section.key}`);

        return `
            <div class="menu-section">
                <div class="menu-item level-1 ${isSelected ? 'active' : ''}" 
                     data-key="item-${section.key}">
                    ${hasChildren ? 
                        `<span class="expand-icon ${isOpen ? 'expanded' : ''}" data-toggle-key="${section.key}">▶</span>` :
                        `<span class="expand-icon placeholder"></span>`
                    }
                    <span class="menu-title" data-scroll-key="item-${section.key}">${section.title}</span>
                </div>
                ${hasChildren ? `
                    <div class="sub-menu ${isOpen ? 'expanded' : ''}">
                        ${section.children.map(child => this.renderSubMenuItem(child)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * 渲染二级菜单项
     * @param {Object} item - 二级菜单数据
     * @returns {string} 菜单项HTML
     */
    renderSubMenuItem(item) {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = this.openKeys.includes(item.key);
        const isSelected = this.selectedKeys.includes(`item-${item.key}`);

        let html = `
            <div class="menu-item level-2 ${isSelected ? 'active' : ''}" 
                 data-key="item-${item.key}">
                ${hasChildren ? 
                    `<span class="expand-icon ${isOpen ? 'expanded' : ''}" data-toggle-key="${item.key}">▶</span>` :
                    `<span class="expand-icon placeholder"></span>`
                }
                <span class="menu-title" data-scroll-key="item-${item.key}">${item.title}</span>
            </div>
        `;

        if (hasChildren) {
            html += `
                <div class="sub-menu level-3 ${isOpen ? 'expanded' : ''}">
                    ${item.children.map(grandChild => this.renderGrandChildMenuItem(grandChild)).join('')}
                </div>
            `;
        }

        return html;
    }

    /**
     * 渲染三级菜单项
     * @param {Object} item - 三级菜单数据
     * @returns {string} 菜单项HTML
     */
    renderGrandChildMenuItem(item) {
        const isSelected = this.selectedKeys.includes(`item-${item.key}`);

        return `
            <div class="menu-item level-3 ${isSelected ? 'active' : ''}" 
                 data-key="item-${item.key}">
                <span class="expand-icon placeholder"></span>
                <span class="menu-title" data-scroll-key="item-${item.key}">${item.title}</span>
            </div>
        `;
    }

    /**
     * 绑定菜单事件
     */
    bindEvents() {
        // 创建统一的点击事件处理器
        this.clickHandler = (e) => {
            // 处理展开/折叠图标点击
            const expandIcon = e.target.closest('.expand-icon');
            if (expandIcon && !expandIcon.classList.contains('placeholder')) {
                e.preventDefault();
                e.stopPropagation();
                const key = expandIcon.getAttribute('data-toggle-key');
                if (key) {
                    this.toggleSubmenu(key);
                    this.onToggleSection(key);
                }
                return;
            }

            // 处理菜单标题点击
            const menuTitle = e.target.closest('.menu-title');
            if (menuTitle) {
                e.preventDefault();
                e.stopPropagation();
                const key = menuTitle.getAttribute('data-scroll-key');
                if (key) {
                    this.selectItem(key);
                    this.onScrollToSection(key);
                }
                return;
            }

            // 处理整个菜单项点击
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                const key = menuItem.getAttribute('data-key');
                if (key) {
                    // 处理可能的展开/折叠
                    const expandIcon = menuItem.querySelector('.expand-icon');
                    if (expandIcon && !expandIcon.classList.contains('placeholder')) {
                        const toggleKey = expandIcon.getAttribute('data-toggle-key');
                        if (toggleKey) {
                            this.toggleSubmenu(toggleKey);
                            this.onToggleSection(toggleKey);
                        }
                    }
                    
                    // 选中当前项并滚动
                    this.selectItem(key);
                    this.onScrollToSection(key);
                }
            }
        };

        // 绑定事件处理器
        this.container.addEventListener('click', this.clickHandler);
    }

    /**
     * 切换子菜单展开/折叠状态
     * @param {string} key - 菜单项键值
     */
    toggleSubmenu(key) {
        const expandIcon = this.container.querySelector(`[data-toggle-key="${key}"]`);
        if (!expandIcon) return;

        const menuItem = expandIcon.closest('.menu-item');
        const subMenu = menuItem.parentElement.querySelector('.sub-menu');
        if (!subMenu) return;

        // 判断当前状态
        const isOpen = subMenu.classList.contains('expanded');

        // 更新DOM和状态
        if (isOpen) {
            // 折叠菜单
            subMenu.classList.remove('expanded');
            expandIcon.classList.remove('expanded');
            // 从openKeys中移除
            const index = this.openKeys.indexOf(key);
            if (index > -1) {
                this.openKeys.splice(index, 1);
            }
        } else {
            // 展开菜单
            subMenu.classList.add('expanded');
            expandIcon.classList.add('expanded');
            // 添加到openKeys
            if (!this.openKeys.includes(key)) {
                this.openKeys.push(key);
            }
        }
    }

    /**
     * 选择菜单项
     * @param {string} key - 菜单项键值
     */
    selectItem(key) {
        // 更新状态
        this.selectedKeys = [key];
        
        // 更新DOM
        this.container.querySelectorAll('.menu-item.active').forEach(item => {
            item.classList.remove('active');
        });

        const selectedItem = this.container.querySelector(`[data-key="${key}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }

    /**
     * 更新展开的菜单项
     * @param {Array} openKeys - 要展开的菜单项键值数组
     */
    updateOpenKeys(openKeys) {
        this.openKeys = openKeys;
        this.updateMenuState();
    }

    /**
     * 更新选中的菜单项
     * @param {Array} selectedKeys - 要选中的菜单项键值数组
     */
    updateSelectedKeys(selectedKeys) {
        this.selectedKeys = selectedKeys;
        this.updateMenuState();
    }

    /**
     * 更新菜单状态，不重新绑定事件
     */
    updateMenuState() {
        // 更新展开状态
        this.container.querySelectorAll('[data-toggle-key]').forEach(expandIcon => {
            const key = expandIcon.getAttribute('data-toggle-key');
            const isOpen = this.openKeys.includes(key);
            const menuItem = expandIcon.closest('.menu-item');
            const subMenu = menuItem.parentElement.querySelector('.sub-menu');

            if (isOpen) {
                if (subMenu) subMenu.classList.add('expanded');
                expandIcon.classList.add('expanded');
            } else {
                if (subMenu) subMenu.classList.remove('expanded');
                expandIcon.classList.remove('expanded');
            }
        });

        // 更新选中状态
        this.container.querySelectorAll('.menu-item').forEach(item => {
            const key = item.getAttribute('data-key');
            if (this.selectedKeys.includes(key)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * 销毁组件，清理事件
     */
    destroy() {
        if (this.clickHandler) {
            this.container.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
    }
}

// 导出导航类到全局
window.Navigation = Navigation;

/**
 * 初始化导航组件
 * 根据当前页面内容自动生成导航菜单
 */
function initializeNavigation() {
    const navContainer = document.getElementById('navigation-container');
    if (!navContainer) {
        console.warn('导航容器不存在');
        return;
    }
    
    // 创建导航实例
    const navigation = new Navigation(navContainer, {
        autoGenerate: true,
        onScrollToSection: function(key) {
            // 滚动到对应章节
            const sectionKey = key.replace('item-', '');
            const section = document.getElementById(sectionKey);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // 初始化导航
    navigation.init();

    // 处理响应式布局
    window.addEventListener('resize', handleNavResize);
    handleNavResize(); // 初始化时执行一次
}

// 导出初始化函数到全局
window.initializeNavigation = initializeNavigation;
