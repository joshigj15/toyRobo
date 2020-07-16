import { createSpyObj } from './create-spy';

export class ToastMock {
    public static instance(): any {
      const instance = createSpyObj('Toast', [
        'present',
        'dismissAll',
        'setContent',
        'setSpinner'
      ]);
      instance.present.and.returnValue(Promise.resolve());
  
      return instance;
    }
}

export class ToastControllerMock {
  public static instance(toast?: ToastMock): any {
    const instance = createSpyObj('ToastController', ['create']);
    instance.create.and.returnValue(toast || ToastMock.instance());

    return instance;
  }
}