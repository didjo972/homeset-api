import {GroupRepository} from '../repositories/GroupRepository';
import {Group} from '../entity/user/Group';

export const selectGroup = async (
  group: number,
  idUserConnected: number,
): Promise<Group | null> => {
  if (group === null || group <= 0) {
    return null;
  } else {
    return await GroupRepository.getOneById(group, idUserConnected);
  }
};

export const matchRequestSubItemsInItemEntity = <T, G, R>(
  item: T,
  subItem: G[],
  findFunc: (t: T, g: G) => Promise<R | undefined>,
): Promise<R>[] => {
  return subItem.map(it => {
    const res = findFunc(item, it);
    if (res !== undefined) {
      return res;
    }
  });
};
