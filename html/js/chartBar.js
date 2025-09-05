/**
 * ChartBar组件 - 根据JSON数据渲染，基于echarts开发
 * 使用方法：
 * const chartBarInstance = new ChartBar(containerElement);
 * chartBarInstance.render({
 *   title: '表格标题', // 表格标题
 *   total: { "num" : 2350, "unit": '万个' }, // 环形图表中心显示的 总数量，null 则不显示
 *   changeInfo: { "num":6565, "unit": '个', "add":false }, // 环形图表中心 左下角 显示的 较上个月的变化，null 则不显示
 *   dataSource: [{ "value": 70.5, "name": '垃圾箱数量（万个）', "itemStyle": { "color": '#FFCF5F' } }, ...], // 环形图表 的显示数据，颜色属性是非必填的，array.length > 5 显示 ‘详情’ 按钮
 * });
 */

/**
 * 环形图表类 - 环形图表组件
 */
class ChartBar {
    /**
     * 构造函数
     * @param {HTMLElement} container - 容器元素
     */
    constructor(container) {
        this.container = container;
        this.baseOption = {
            backgroundColor: '#FAFAFA',
            title: {
                text: '',
                left: '20',
                textStyle: {
                    color: '#303133',          // 字体颜色
                    fontSize: 14,           // 字体大小（px）
                    lineHeight: 20,
                    fontWeight: '500'     // 加粗程度（normal/bold/bolder/lighter）
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },

            xAxis: {
    type: 'category',
    data: ['3-5年', '5年', '5-8年', '8年以上']
  },
  yAxis: {
    type: 'value',
    splitNumber: 10,
    name: '车辆数量（辆）',  // 标题文本内容
    nameLocation: 'end',  // 标题位置(end/start/center)
    nameTextStyle: {  // 标题样式
        color: '#666',
        fontSize: 12,
        padding: [0, 60, 0, 0]  // 上右下左间距
    },
    nameGap: 15  // 标题与轴线距离
  },
  series: [
    {
      data: [75, 36, 31, 19],
      barWidth: '30%',
      type: 'bar',
      name: '111',
                  grid: {
                top: '15%',  // 支持百分比或像素值（如80）
                containLabel: true  // 确保坐标轴标签包含在内
            },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' }
        ])
      },
      label: {
        show: true,     // 显示标签
        position: 'top',// 标签位置（顶部）
        formatter: '{c}',// 显示数据值
        textStyle: {
          color: '#333',// 文字颜色
          fontSize: 12  // 文字大小
        }
      }
    }
  ]
        };
    }

    /**
     * 渲染
     * @param {Object} options - 表格配置选项
     * @param {string} options.title - 标题
     * @param {Object} [options.total={num:0,unit:'个'}] - 总数量
     * @param {Object} [options.changeInfo={num:0,unit:'个',add:false}] - 左下角的提示较上月变化信息
     * @param {Array} options.dataSource - 数据源
     */
    render(options = {}) {
        if (!this.container) return;
        this.chart = echarts.init(this.container);
        // 设置属性
        this.baseOption.title.text = options.title;


        this.chart.setOption(this.baseOption)
        window.addEventListener('resize', () => {
            this.chart.resize()
        });
    }
    
}

// 导出到全局
window.ChartBar = ChartBar;
