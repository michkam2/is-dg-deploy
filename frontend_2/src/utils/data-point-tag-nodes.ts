import { Collection } from '@/models/Collection';
import { DataPointTagNode } from '@/models/DataPointTagNode';
import { Device } from '@/models/Device';
import { Module } from '@/models/Module';

function deviceToDataPointTagNode(device: Device): DataPointTagNode {
  return {
    uid: device.uid,
    name: device.name,
    children:
      device.dataPointTags?.map((tag) => ({
        uid: tag.uid,
        name: tag.name,
        isActive: false,
        dataPointTag: tag,
        children: [],
      })) ?? [],
  };
}

function moduleToDataPointTagNode(module: Module): DataPointTagNode {
  return {
    uid: module.uid,
    name: module.name,
    children: module.devices?.map(deviceToDataPointTagNode) ?? [],
  };
}

function collectionToDataPointTagNode(coll: Collection): DataPointTagNode {
  return {
    uid: coll.uid,
    name: coll.name,
    children: coll.modules?.map(moduleToDataPointTagNode) ?? [],
  };
}

function nodeToDataPointTags(node: DataPointTagNode, seenUids = new Set()) {
  if (!node) return [];

  const { dataPointTag, children } = node;
  const tags = [];

  if (dataPointTag && !seenUids.has(dataPointTag.uid)) {
    seenUids.add(dataPointTag.uid);
    tags.push(dataPointTag);
  }

  if (children) {
    children.forEach((child) => {
      tags.push(...nodeToDataPointTags(child, seenUids));
    });
  }

  return tags;
}

function extractNodeKeys(node: DataPointTagNode): string[] {
  if (!node.children) {
    return [node.uid];
  }
  return [node.uid, ...node.children.flatMap(extractNodeKeys)];
}

export {
  collectionToDataPointTagNode,
  moduleToDataPointTagNode,
  deviceToDataPointTagNode,
  nodeToDataPointTags,
  extractNodeKeys,
};
