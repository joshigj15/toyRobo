import { createSpyObj } from './create-spy';

export class PopoverMock {
  public static instance(): any {
    const instance = createSpyObj('Popover', [
      'present',
      'dismissAll',
      'setContent',
      'setSpinner'
    ]);
    instance.present.and.returnValue(Promise.resolve());
    return instance;
  }
}

export class PopoverControllerMock {
  public static instance(popOver?: PopoverMock): any {
    const instance = createSpyObj('PopoverController', ['create']);
    instance.create.and.returnValue(popOver || PopoverMock.instance());

    return instance;
  }
}