import { createSpyObj } from './create-spy';

export class AlertMock {
  public static instance(): any {
    let _dismissCallback: Function;
    const instance = createSpyObj('Alert', [
      'present',
      'dismiss',
      'onDidDismiss'
    ]);
    instance.present.and.returnValue(Promise.resolve());

    instance.dismiss.and.callFake(x => {
      _dismissCallback(x);
      return Promise.resolve();
    });

    instance.onDidDismiss.and.callFake((callback: Function) => {
      if (callback) {
        _dismissCallback = callback;
      }
    });

    return instance;
  }
}


export class AlertControllerMock {
  public static instance(alertMock?: AlertMock): any {
    const instance = createSpyObj('AlertController', ['create']);
    instance.create.and.returnValue(alertMock || AlertMock.instance());

    return instance;
  }
}