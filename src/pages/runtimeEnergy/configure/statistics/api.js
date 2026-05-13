import { Apimethod } from "@api/api.js"

/**
 * 获取区域下的设备数量
 */
export const { useQueryAreaDeviceNum } = new Apimethod(
    "get",
    "General/Area/QueryAreaDeviceNum"
);

/**
 * 获取区域下的设备详情
 */
export const { useQueryUsedMeter } = new Apimethod(
    "get",
    "General/Area/QueryUsedMeter"
);

/**
 * 添加区域分表 //  排序
 */
export const { useAddSubDeviceOrder } = new Apimethod(
    "post",
    "General/Area/AddSubDeviceOrder"
);

/**
 * 添加区域总表 //  排序
 */
export const { useAddSummaryDeviceOrder } = new Apimethod(
    "post",
    "General/Area/AddSummaryDeviceOrder"
);

/**
 * 获取区域下的所有设备详情
 */
export const { useQueryAreaAllDevicesWithAllocation } = new Apimethod(
    "get",
    "General/Area/QueryAreaAllDevicesWithAllocation"
);