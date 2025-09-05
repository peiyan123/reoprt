/**
 * ChartRing组件 - 根据JSON数据渲染，基于echarts开发
 * 使用方法：
 * const chartRingInstance = new ChartRing(containerElement);
 * chartRingInstance.render({
 *   title: '表格标题', // 表格标题
 *   dataSource: [...], // 数据源
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
                left: '20'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            }
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
        // 区域绘制
        this.baseOption.graphic = [];
        // 显示总数量
        if (options.total) {
            this.baseOption.graphic.push({
                type: 'text',
                left: 'center',
                top: '40%',
                style: {
                    text: [`{a1|${options.total.num}}`, `{b1|总数量${options.total.unit?`（${options.total.unit}）`:''}}`].join('\n'),
                    rich: {
                        a1: { fontSize: 36, fill: '#1A1A1A', textAlign: 'center' },
                        b1: { fontSize: 16, fill: '#808080', textAlign: 'center', lineHeight: '36' }
                    }
                }
            })
        }
        // 显示 左下角的提示信息
        if (options.changeInfo) {
            this.baseOption.graphic.push({
                type: 'text',
                left: '10',
                bottom: '10',
                style: {
                    text: `{a1|较上月} ${options.changeInfo.add?`{b2|增加${options.changeInfo.num}${options.changeInfo.unit}↑}`:`{b1|减少${options.changeInfo.num}${options.changeInfo.unit}↓}`}`,
                    rich: {
                        a1: { fontSize: 12, fill: '#808080', textAlign: 'center' },
                        b1: { fontSize: 12, fill: '#00A857', textAlign: 'center', lineHeight: '36' },
                        b2: { fontSize: 12, fill: '#a8000b', textAlign: 'center', lineHeight: '36' }
                    }
                }
            })
        }
        // 显示详情 数据量大于5时显示详情
        if (options.dataSource.length>5) {
            this.baseOption.graphic.push({
                type: 'text',
                right: '2%',
                top: '5%',
                style: {
                    text: '详情 >',
                    fill: '#006F3F'
                },
                id: 'detail',
                onclick: function() {
                    alert('文本点击触发');
                    this.detail && this.detail(options.dataSource)
                }
            })
        }
        // 环形图表数据
        this.baseOption.series = [{
            type: 'pie',
            name: options.title,
            radius: ['50%', '60%'],
            emphasis: {
                label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold'
                }
            },
            padAngle: 2,
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 2, borderColor: '#fff', borderWidth: 2 },
            label: {
                show: true,
                position: 'outer',
                alignTo: 'labelLine',
                formatter: params => {
                    return [
                    `{circle|●} {name|${params.name}}`,
                    `{value|${params.value} (${params.percent}%)}`
                    ].join('\n');
                },
                rich: {
                    circle: {
                    color: 'inherit',
                    fontSize: 14,
                    lineHeight: 20
                    },
                    name: { fontSize: 12, color: '#808080'},
                    value: { fontSize: 12, color: '#1A1A1A', align: 'center' },
                    per: { fontSize: 12, color: '#999' }
                },
                padding: [-5, -120],  // 关键参数：控制标签与引导线的垂直间距
                distanceToLabelLine: 0
            },
            labelLine: {
                length: 20,    // 第一段引导线长度
                length2: 180,   // 第二段引导线长度
                smooth: true,
                lineStyle: { width: 1, color: '#ccc' }
            },
            labelLayout: {   // 自动调整布局
                verticalAlign: 'bottom',
                hideOverlap: false,
                dy: -5
            },
            data: options.dataSource
            // data: [
            //     { value: 7.5, name: '垃圾箱数量（万个）', itemStyle: { color: '#FFCF5F' } },
            //     { value: 7.5, name: '人力车数量（万个）', itemStyle: { color: '#2276FC' } },
            //     { value: 75, name: '其他器具数量（万个）', itemStyle: { color: '#52C066' } },
            //     { value: 25, name: '垃圾桶数量（万个）', itemStyle: { color: '#F99C58' } }
            // ]
        }]
        this.chart.setOption(this.baseOption)
    }
    
}

// 导出到全局
window.ChartBar = ChartBar;
