// 用于初始化所有组件和处理全局功能

// 初始化标签页
function initializeTabs() {
  // 标签页交互已经移至dataLoader.js中处理
  console.log('标签页初始化交由dataLoader处理');
}

// 检测设备类型
function isMobile() {
  return window.innerWidth < 768;
}

// 处理响应式布局
function handleResponsiveLayout() {
  // 响应式布局已经移至dataLoader.js中处理
  console.log('响应式布局交由dataLoader处理');
}

// 添加折叠功能 - 禁用自动添加折叠图标，避免▼符号累积问题
function addCollapseHandlers() {
  // 检查是否已经存在折叠图标，避免重复添加
  document.querySelectorAll('.content-section > h2').forEach(heading => {
    // 如果已经有折叠图标，则跳过
    if (heading.querySelector('.collapse-icon')) {
      return;
    }

    // 添加点击事件但不添加折叠图标，以避免累积▼符号
    heading.addEventListener('click', function () {
      // 获取该标题下的内容容器
      const parentSection = heading.parentElement;
      const contentContainer = parentSection.querySelector('.section-content-container');

      if (contentContainer) {
        // 切换显示/隐藏状态
        const isCollapsed = contentContainer.style.display === 'none';
        contentContainer.style.display = isCollapsed ? 'block' : 'none';
      }
    });
  });
}

// 添加平滑滚动
function addSmoothScroll() {
  // 为导航菜单项添加平滑滚动
  document.querySelectorAll('.menu-title').forEach(menuItem => {
    menuItem.addEventListener('click', function (e) {
      const target = this.getAttribute('data-target');
      if (target) {
        const targetElement = document.getElementById(target);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// 初始化交互功能
function initializeInteractions() {
  // 延迟执行，确保动态内容已加载
  setTimeout(() => {
    // 先移除所有折叠图标，然后再添加处理程序 (不会添加新的图标)
    removeAllCollapseIcons();

    // 不再添加折叠图标，但保留折叠功能
    addCollapseHandlers();
    addSmoothScroll();
  }, 500);
}

// 初始化页面组件
function initializeComponents() {
  // 由于我们现在完全依赖data.json的数据，所以初始化工作主要在dataLoader.js中完成
  // 这里只做一些额外的增强

  // 监听动态内容变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 内容变化时，初始化交互功能
        initializeInteractions();
      }
    });
  });

  // 观察报告内容容器
  const reportContainer = document.getElementById('report-content-container');
  if (reportContainer) {
    observer.observe(reportContainer, { childList: true, subtree: true });
  }
}

// 清除所有折叠图标，防止▼符号累积
function removeAllCollapseIcons() {
  // 移除所有折叠图标
  document.querySelectorAll('.collapse-icon').forEach(icon => {
    icon.parentNode.removeChild(icon);
  });

  // 查找所有可能的▼符号文本节点并移除
  document.querySelectorAll('.content-section > h2').forEach(heading => {
    // 获取所有文本节点
    const textNodes = [];
    heading.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
        textNodes.push(node);
      }
    });

    // 检查并移除包含▼的节点
    textNodes.forEach(node => {
      if (node.textContent && node.textContent.includes('▼')) {
        const newText = node.textContent.replace(/▼/g, '');
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = newText;
        } else {
          node.innerHTML = node.innerHTML.replace(/▼/g, '');
        }
      }
    });
  });
}

// 优化PDF内容分页的函数
function optimizePDFContent(content) {
  // 为重要内容添加分页控制类
  const contentSections = content.querySelectorAll('.content-section');
  contentSections.forEach(section => {
    section.classList.add('avoid-page-break');

    // 找到section内的标题和内容块
    const heading = section.querySelector('h2, h3, h4');
    if (heading) {
      heading.classList.add('keep-with-next');

      // 确保标题后的第一个元素与标题在同一页
      const firstElement = heading.nextElementSibling;
      if (firstElement) {
        firstElement.classList.add('keep-with-previous');
      }
    }
    
    // 为section内的图表添加额外间距
    const sectionCharts = section.querySelectorAll('.chart-container, [id^="chart-"]');
    sectionCharts.forEach(chart => {
      chart.style.marginTop = '30px';
      chart.style.marginBottom = '30px';
      chart.style.paddingTop = '15px';
      chart.style.paddingBottom = '15px';
    });
  });

  // 优化表格
  const tables = content.querySelectorAll('table');
  tables.forEach(table => {
    table.classList.add('avoid-page-break');

    // 如果表格有标题，确保标题与表格在同一页
    const tableParent = table.parentElement;
    if (tableParent) {
      const prevHeading = tableParent.previousElementSibling;
      if (prevHeading && (prevHeading.tagName === 'H2' || prevHeading.tagName === 'H3' || prevHeading.tagName === 'H4')) {
        prevHeading.classList.add('keep-with-next');
        tableParent.classList.add('keep-with-previous');
      }
    }
  });

  // 优化卡片布局
  const cardRows = content.querySelectorAll('.card-grid-row, .mobile-card-row, .card-grid-row-container');
  cardRows.forEach(row => {
    row.classList.add('avoid-page-break');
  });

  // 单独处理每个卡片
  const cards = content.querySelectorAll('.card-grid-item');
  cards.forEach(card => {
    card.classList.add('avoid-page-break');
  });

    // 处理图表
  const charts = content.querySelectorAll('.chart-container, [class*="chart"]');
  charts.forEach(chart => {
    chart.classList.add('avoid-page-break');
    // 添加额外的间距样式
    chart.style.marginTop = '25px';
    chart.style.marginBottom = '25px';
    chart.style.paddingTop = '15px';
    chart.style.paddingBottom = '15px';
  });  return content;
}

// 导出PDF功能 - 直接生成PDF文件并优化分页
function exportToPDF() {
  try {
    // 显示加载提示
    const loadingElement = document.createElement('div');
    loadingElement.className = 'pdf-loading';
    loadingElement.innerHTML = '正在生成PDF，请稍候...<br><span style="font-size:14px;margin-top:8px;display:block;">处理内容优化中，这可能需要几秒钟</span>';
    loadingElement.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(255,255,255,0.9); display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999; font-size:18px; color:#00532C;';
    document.body.appendChild(loadingElement);

    // 获取基本信息和内容
    const tabName = document.getElementById('current-tab-name')?.textContent || '';
    const reportTitle = document.querySelector('.report-title')?.textContent || '投资企业月报';
    const companyName = document.querySelector('.company-name')?.textContent || '';
    const date = document.querySelector('.generate-date')?.textContent || '';
    const fileName = `${companyName}${tabName ? '-' + tabName : ''}-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;

    const activeTabContent = document.querySelector('.tab-content.active');
    if (!activeTabContent) {
      document.body.removeChild(loadingElement);
      alert('未找到内容，无法导出');
      return;
    }
    
    // 在原始页面上处理图表，确保它们被正确捕获
    const prepareChartsForExport = () => {
      return new Promise((resolve) => {
        // 找到所有图表容器
        const chartElements = document.querySelectorAll('.chart-container, [id^="chart-"]');
        console.log(`找到 ${chartElements.length} 个图表容器`);
        
        // 如果没有图表，直接返回
        if (chartElements.length === 0) {
          console.log('没有找到图表，继续导出');
          return resolve([]);
        }
        
        const chartImagesData = [];
        let processed = 0;
        
        // 处理每个图表
        chartElements.forEach(container => {
          try {
            const chartInstance = echarts.getInstanceByDom(container);
            if (!chartInstance) {
              console.log(`容器 ${container.id || '未命名'} 没有关联的ECharts实例`);
              processed++;
              if (processed === chartElements.length) {
                resolve(chartImagesData);
              }
              return;
            }
            
            console.log(`处理图表: ${container.id || '未命名图表'}`);
            
            // 获取图表尺寸
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            // 获取图表的数据URL
            const dataURL = chartInstance.getDataURL({
              type: 'png',
              pixelRatio: 2,
              backgroundColor: '#ffffff'
            });
            
            // 创建图像元素直接插入原始DOM，便于html2canvas捕获
            const imgContainer = document.createElement('div');
            imgContainer.className = 'chart-image-for-pdf';
            imgContainer.style.width = width + 'px';
            imgContainer.style.height = height + 'px';
            imgContainer.style.position = 'absolute';
            imgContainer.style.left = '0';
            imgContainer.style.top = '0';
            imgContainer.style.zIndex = '1000';
            imgContainer.style.marginTop = '20px';
            imgContainer.style.marginBottom = '20px';
            imgContainer.style.paddingTop = '10px';
            imgContainer.style.paddingBottom = '10px';
            
            const img = document.createElement('img');
            img.src = dataURL;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.display = 'block';
            img.style.marginTop = '10px';
            img.style.marginBottom = '10px';
            
            imgContainer.appendChild(img);
            
            // 在原图表的父容器中添加图像版本
            container.parentNode.insertBefore(imgContainer, container);
            
            // 记录下需要后续清理的元素
            chartImagesData.push({
              original: container,
              image: imgContainer
            });
            
            // 隐藏原始图表
            container.style.visibility = 'hidden';
            
            console.log(`完成图表处理: ${container.id || '未命名图表'}`);
          } catch (error) {
            console.error(`处理图表时出错:`, error);
          }
          
          processed++;
          if (processed === chartElements.length) {
            console.log(`完成所有图表处理，共 ${chartImagesData.length} 个`);
            resolve(chartImagesData);
          }
        });
        
        // 防止永久等待
        setTimeout(() => {
          console.log(`处理超时，返回已处理的 ${chartImagesData.length} 个图表`);
          resolve(chartImagesData);
        }, 1500);
      });
    };
    
    // 清理添加的图像
    const cleanupChartImages = (chartImagesData) => {
      chartImagesData.forEach(item => {
        // 移除图像元素
        if (item.image && item.image.parentNode) {
          item.image.parentNode.removeChild(item.image);
        }
        
        // 恢复原始图表可见性
        if (item.original) {
          item.original.style.visibility = '';
        }
      });
      console.log('已清理所有临时图表图像');
    };
    
    // 准备图表并创建导出PDF
    prepareChartsForExport().then(chartImagesData => {
      // 创建临时导出容器
      const exportContainer = document.createElement('div');
      exportContainer.style.cssText = 'position:absolute; left:-9999px; width:800px; background:#fff; padding:20px; font-family: Arial, "Microsoft YaHei", sans-serif;';

      // 添加标题
      exportContainer.innerHTML = `
        <div style="margin-bottom:20px; border-bottom:1px solid #eaeaea; padding-bottom:15px;">
            <h1 style="margin:0 0 10px 0; color:#00532C; font-size:24px; text-align:center;">${reportTitle}</h1>
            <div style="font-size:14px; color:#666; display:flex; justify-content:space-between;">
                <span style="text-align:left;">${companyName}</span>
                <span style="text-align:right;">${date}</span>
            </div>
        </div>
      `;

      // 处理并添加内容
      const contentClone = activeTabContent.cloneNode(true);

      // 移除不需要的元素
      contentClone.querySelectorAll('.section-toggle-btn').forEach(el => el.remove());

      // 替换SVG元素
      contentClone.querySelectorAll('svg').forEach(svg => {
        const span = document.createElement('span');
        if (svg.parentElement?.classList.contains('card-value-up')) {
          span.textContent = '↑';
          span.style.color = '#00A857';
        } else if (svg.parentElement?.classList.contains('card-value-down')) {
          span.textContent = '↓';
          span.style.color = '#D35A21';
        } else if (svg.getAttribute('data-icon') === 'right') {
          span.textContent = '→';
        }
        svg.parentNode?.replaceChild(span, svg);
      });

      // 优化内容分页
      optimizePDFContent(contentClone);

      // 添加到导出容器
      exportContainer.appendChild(contentClone);
      document.body.appendChild(exportContainer);
      
      console.log('导出容器准备完成，开始捕获内容');
      
      // 给图片加载一些时间
      setTimeout(() => {
        // 使用html2canvas捕获原始内容（包含添加的图表图像）
        html2canvas(activeTabContent, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          windowWidth: 1000,
          logging: false
        }).then(contentCanvas => {
          // 清理在原始DOM中添加的图表图像
          cleanupChartImages(chartImagesData);
          
          console.log('成功捕获含图表的内容，开始生成PDF');
          
          // 重新创建一个干净的内容容器
          const finalContainer = document.createElement('div');
          finalContainer.style.cssText = 'position:absolute; left:-9999px; width:800px; background:#fff; padding:20px; font-family: Arial, "Microsoft YaHei", sans-serif;';

          // 添加标题
          finalContainer.innerHTML = `
            <div style="margin-bottom:20px; border-bottom:1px solid #eaeaea; padding-bottom:15px;">
                <h1 style="margin:0 0 10px 0; color:#00532C; font-size:24px; text-align:center;">${reportTitle}</h1>
                <div style="font-size:14px; color:#666; display:flex; justify-content:space-between;">
                    <span style="text-align:left;">${companyName}</span>
                    <span style="text-align:right;">${date}</span>
                </div>
            </div>
          `;
          
          // 添加捕获的内容图像
          const contentImg = document.createElement('img');
          contentImg.src = contentCanvas.toDataURL('image/jpeg', 0.95);
          contentImg.style.width = '100%';
          contentImg.style.maxWidth = '100%';
          contentImg.style.display = 'block';
          
          // 包装图像到一个有间距的容器中
          const contentWrapper = document.createElement('div');
          contentWrapper.style.width = '100%';
          contentWrapper.style.lineHeight = '1.5';  // 增加行距
          contentWrapper.style.letterSpacing = '0.5px';  // 增加字间距
          contentWrapper.appendChild(contentImg);
          
          finalContainer.appendChild(contentWrapper);
          
          document.body.appendChild(finalContainer);
          
          // 添加额外的样式到finalContainer来增加图表间距
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .chart-container, [id^="chart-"] {
          margin-top: 25px !important;
          margin-bottom: 25px !important;
          padding-top: 15px !important;
          padding-bottom: 15px !important;
        }
        .chart-image-for-pdf {
          margin-top: 25px !important;
          margin-bottom: 25px !important;
          padding-top: 15px !important;
          padding-bottom: 15px !important;
        }
      `;
      finalContainer.appendChild(styleElement);

      // 使用html2canvas将整个finalContainer转为canvas
      html2canvas(finalContainer, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        windowWidth: 1000,
        logging: false
      }).then(canvas => {
        console.log('内容已渲染为最终Canvas，生成PDF');
            
            // 使用jsPDF创建PDF
            const { jsPDF } = window.jspdf;
            
            // 使用改进的jsPDF初始化参数
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
              compress: true,
              hotfixes: ['px_scaling'],
              putOnlyUsedFonts: true,
              floatPrecision: 16  // 提高浮点精度，保证更精确的渲染
            });
            
            // PDF尺寸计算 - 增加上下边距
            const imgWidth = 185; // A4宽度减去边距
            const pageHeight = 267; // A4高度减去边距，增加上下空间
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            // 添加第一页，增加上下边距
            pdf.addImage(canvas, 'JPEG', 12.5, 15, imgWidth, imgHeight); // 增加左右和上边距
            heightLeft -= pageHeight;
            
            // 如果内容超过一页，添加更多页，确保页面间的间距更合适
            while (heightLeft > 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              // 调整偏移量，增加上下边距
              pdf.addImage(canvas, 'JPEG', 12.5, position + 15, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
            
            // 保存PDF
            console.log('PDF创建完成，准备下载');
            pdf.save(fileName);
            
            // 清理
            document.body.removeChild(finalContainer);
            document.body.removeChild(exportContainer);
            document.body.removeChild(loadingElement);
            console.log('PDF导出完成，已清理所有临时元素');
            
          }).catch(error => {
            console.error('生成最终PDF时出错:', error);
            cleanupChartImages(chartImagesData);
            if (finalContainer.parentNode) document.body.removeChild(finalContainer);
            if (exportContainer.parentNode) document.body.removeChild(exportContainer);
            if (loadingElement.parentNode) document.body.removeChild(loadingElement);
            alert('生成PDF时出错: ' + error.message);
          });
        }).catch(error => {
          console.error('捕获内容时出错:', error);
          cleanupChartImages(chartImagesData);
          if (exportContainer.parentNode) document.body.removeChild(exportContainer);
          if (loadingElement.parentNode) document.body.removeChild(loadingElement);
          alert('捕获内容时出错: ' + error.message);
        });
      }, 1000); // 给图像加载足够的时间
      
    }).catch(error => {
      console.error('准备图表时出错:', error);
      if (loadingElement.parentNode) {
        document.body.removeChild(loadingElement);
      }
      alert('准备图表时出错: ' + error.message);
    });
    
  } catch (error) {
    console.error('导出操作失败:', error);
    const loadingEl = document.querySelector('.pdf-loading');
    if (loadingEl && loadingEl.parentNode) {
      document.body.removeChild(loadingEl);
    }
    alert('导出操作失败: ' + error.message);
  }
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function () {
  // 移除所有可能存在的折叠图标
  removeAllCollapseIcons();

  // 初始化组件和交互 (修改后不再添加折叠图标)
  initializeComponents();

  // 监听DOM变化，持续移除折叠图标
  const observer = new MutationObserver((mutations) => {
    removeAllCollapseIcons();
  });

  // 观察整个文档以捕获所有变化
  observer.observe(document.body, { childList: true, subtree: true });

  // 添加PDF导出按钮事件
  document.getElementById('export-pdf-btn')?.addEventListener('click', exportToPDF);
  document.getElementById('mobile-export-pdf-btn')?.addEventListener('click', exportToPDF);

  // 报告数据的加载和渲染由dataLoader.js处理
  console.log('页面初始化完成，等待数据加载...');
});
