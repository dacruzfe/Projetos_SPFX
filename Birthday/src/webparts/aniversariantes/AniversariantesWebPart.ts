import { sp } from "@pnp/sp/presets/all";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as React from 'react';
import * as ReactDom from 'react-dom';
import Aniversariantes from './components/Aniversariantes';
import { IAniversariantesProps } from './components/IAniversariantesProps';

export interface IMyWebPartProps {
  description: string;
}

export default class MyWebPart extends BaseClientSideWebPart<IMyWebPartProps> {

  public onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context as any
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IAniversariantesProps> = React.createElement(
      Aniversariantes,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }
}
