Ext.ux.SlickCardLayout = Ext.extend(Ext.layout.CardLayout, {

    setActiveItem : function(item){
        item = this.container.getComponent(item);
        if(this.activeItem != item){
            if(this.activeItem){
                this.activeItem.hide();
            }
            this.activeItem = item;
            this.layout();
            item.show();
            item.getEl().fadeIn({
          duration: 1.5
      });
        }
    }
}); // end of extend
Ext.Container.LAYOUTS['slickcard'] = Ext.ux.SlickCardLayout;