// tab.js - 标签页管理模块

// 生成标签页
function generateTabs(data) {
    if (!data || data.length === 0 || !data[0].tabList) return;
    
    const tabList = data[0].tabList;
    const tabsContainer = document.querySelector('.ant-tabs-nav-list');
    const mobileTabsContainer = document.querySelector('.mobile-buttons');
    const tabContentHolder = document.querySelector('.ant-tabs-content');
    const reportContentContainer = document.getElementById('report-content-container');
    
    if (!tabsContainer || !mobileTabsContainer || !tabContentHolder || !reportContentContainer) return;
    
    // 清除现有标签页
    tabsContainer.innerHTML = '';
    mobileTabsContainer.innerHTML = '';
    tabContentHolder.innerHTML = '';
    reportContentContainer.innerHTML = '';
    
    // 添加标签页
    tabList.forEach((tab, index) => {
        const key = `tab-${index}`;
        const isActive = index === 0;
        
        // 桌面端标签页
        const tabElement = document.createElement('div');
        tabElement.className = `ant-tabs-tab ${isActive ? 'ant-tabs-tab-active' : ''}`;
        tabElement.setAttribute('data-tab', key);
        tabElement.innerHTML = `<div role="tab" aria-selected="${isActive}" class="ant-tabs-tab-btn" tabindex="0">${tab.name}</div>`;
        tabsContainer.appendChild(tabElement);
        
        // 移动端按钮
        const mobileBtn = document.createElement('button');
        mobileBtn.className = `ant-btn ${isActive ? 'ant-btn-primary mobile-tab-btn active' : 'mobile-tab-btn'}`;
        mobileBtn.setAttribute('data-tab', key);
        mobileBtn.textContent = tab.name;
        mobileTabsContainer.appendChild(mobileBtn);
        
        // 标签内容区域
        const contentElement = document.createElement('div');
        contentElement.role = 'tabpanel';
        contentElement.tabIndex = isActive ? 0 : -1;
        contentElement.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        contentElement.className = `ant-tabs-tabpane ${isActive ? 'ant-tabs-tabpane-active' : ''}`;
        contentElement.id = `tab-content-${key}`;
        contentElement.style.display = isActive ? 'block' : 'none';
        contentElement.setAttribute('data-tab-content', key);
        
        tabContentHolder.appendChild(contentElement);
        
        // 为每个标签页创建内容容器
        const tabContentContainer = document.createElement('div');
        tabContentContainer.id = `tab-content-container-${key}`;
        tabContentContainer.className = `tab-content ${isActive ? 'active' : ''}`;
        tabContentContainer.style.display = isActive ? 'block' : 'none';
        reportContentContainer.appendChild(tabContentContainer);
    });
    
    // 添加墨水条
    const inkBar = document.createElement('div');
    inkBar.className = 'ant-tabs-ink-bar ant-tabs-ink-bar-animated';
    tabsContainer.appendChild(inkBar);
    
    // 绑定标签页点击事件
    bindTabEvents();
    
    // 设置默认墨水条位置
    setTimeout(() => {
        const activeTab = document.querySelector('.ant-tabs-tab-active');
        if (activeTab && inkBar) {
            const tabRect = activeTab.getBoundingClientRect();
            const navListRect = activeTab.parentElement.getBoundingClientRect();
            
            inkBar.style.width = `${tabRect.width}px`;
            inkBar.style.left = `${tabRect.left - navListRect.left}px`;
            inkBar.style.display = 'block';
        }
    }, 0);
}

// 绑定标签页点击事件
function bindTabEvents() {
    // 桌面端标签页
    const tabs = document.querySelectorAll('.ant-tabs-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabKey = this.getAttribute('data-tab');
            switchTab(tabKey);
        });
    });
    
    // 移动端标签页
    const mobileTabs = document.querySelectorAll('.mobile-tab-btn');
    mobileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabKey = this.getAttribute('data-tab');
            switchTab(tabKey);
        });
    });
}

// 切换标签页
function switchTab(tabKey) {
    // 更新标签页活动状态
    let activeTabElement = null;
    document.querySelectorAll('.ant-tabs-tab').forEach(tab => {
        tab.classList.remove('ant-tabs-tab-active');
        if (tab.getAttribute('data-tab') === tabKey) {
            tab.classList.add('ant-tabs-tab-active');
            activeTabElement = tab;
        }
    });
    
    // 更新墨水条位置
    if (activeTabElement) {
        const inkBar = document.querySelector('.ant-tabs-ink-bar');
        if (inkBar) {
            const tabRect = activeTabElement.getBoundingClientRect();
            const navListRect = activeTabElement.parentElement.getBoundingClientRect();
            
            inkBar.style.width = `${tabRect.width}px`;
            inkBar.style.left = `${tabRect.left - navListRect.left}px`;
            inkBar.style.display = 'block';
        }
    }
    
    // 更新移动端按钮活动状态
    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('ant-btn-primary');
        if (btn.getAttribute('data-tab') === tabKey) {
            btn.classList.add('active');
            btn.classList.add('ant-btn-primary');
        }
    });
    
    // 更新标签内容显示
    document.querySelectorAll('.ant-tabs-tabpane').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('ant-tabs-tabpane-active');
        content.setAttribute('aria-hidden', 'true');
        content.tabIndex = -1;
        
        if (content.id === `tab-content-${tabKey}`) {
            content.style.display = 'block';
            content.classList.add('ant-tabs-tabpane-active');
            content.setAttribute('aria-hidden', 'false');
            content.tabIndex = 0;
        }
    });
    
    // 更新报告内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
        
        if (content.id === `tab-content-container-${tabKey}`) {
            content.style.display = 'block';
            content.classList.add('active');
        }
    });
    
    // 更新当前标签名称
    const currentTabNameElement = document.getElementById('current-tab-name');
    let tabName = '';
    if (currentTabNameElement) {
        const activeTabBtn = document.querySelector(`.ant-tabs-tab[data-tab="${tabKey}"] .ant-tabs-tab-btn`);
        if (activeTabBtn) {
            tabName = activeTabBtn.textContent;
            currentTabNameElement.textContent = tabName;
        }
    }
    
    // 在移动端视图中隐藏报告头部信息，仅显示tab标题
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        // 隐藏报告头部信息
        const reportHeader = document.querySelector('.report-header');
        if (reportHeader) {
            reportHeader.style.display = 'none';
        }
    }
    
    // 更新移动端主标题
    const mobileReportTitle = document.querySelector('.mobile-report-title');
    if (mobileReportTitle && tabName) {
        const reportData = window.reportData || {};
        const title = reportData.title || document.title;
        // 移动端不拼接tab名，只显示报告标题
        mobileReportTitle.textContent = title;
    }

    // 更新移动端Tab标题
    const mobileTabTitle = document.querySelector('.mobile-tab-title');
    if (mobileTabTitle && tabName) {
        mobileTabTitle.textContent = tabName;
    }

    // 在移动端视图中处理标题显示
    if (window.innerWidth < 768) {
        // 隐藏报告头部中的标题信息，只保留移动端tab标题
        const reportHeader = document.querySelector('.report-header');
        if (reportHeader) {
            reportHeader.style.display = 'none';
        }
    }
    
    // 重新生成导航
    if (window.initializeNavigation) {
        setTimeout(() => {
            window.initializeNavigation();
        }, 200);
    }
}

// 导出到全局
window.tabManager = {
    generateTabs,
    bindTabEvents,
    switchTab
};
