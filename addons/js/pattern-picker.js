/*  A SelectedColor() helper  */
var rgb2hex = ( rgb ) =>
{
  if ( /^#[0-9A-F]{6}$/i.test( rgb ) )
  {
    return rgb;
  }
  rgb = rgb.match( /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/ );
  var hex = ( x ) =>
  {
    return ( "0" + parseInt( x ).toString( 16 ) ).slice( -2 ).toUpperCase();
  }
  return "#" + hex( rgb[ 1 ] ) + hex( rgb[ 2 ] ) + hex( rgb[ 3 ] );
}
QUnit.test( "Pattern Chooser", ( assert ) =>
{
  assert.equal( rgb2hex( 'rgb(238, 87, 87)' ), "#EE5757" );
} );
/*  For selecting/locating and adjusting the SVG shapes  */
var shapes = 'text,path,rect,line,circle,polygon,ellipse,polyline';
var DataColorOfShapes = () =>
{
  var DataColorOfShapes = shapes.split( ',' ).map( ( tag ) =>
  {
    return tag + '[ data-color ]';
  } );
  return DataColorOfShapes;
}
var DataColorOfShapesIs = ( selectedColor ) =>
{
  var DataColorOfShapesIs = shapes.split( ',' ).map( ( tag ) =>
  {
    return tag + '[ data-color = "' + selectedColor + '" ]';
  } );
  return DataColorOfShapesIs.toString();
}
var FillOfShapesIs = ( selectedColor ) =>
{
  var FillOfShapesIs = shapes.split( ',' ).map( ( tag ) =>
  {
    return tag + '[ fill = "' + selectedColor + '" ]';
  } );
  return FillOfShapesIs.toString();
}
var Item = () =>
{
  return design.item.get();
}
var ItemWidth = () =>
{
  return parseInt( jQuery( Item() ).css( 'width' ) );
}
var ItemHeight = () =>
{
  return parseInt( jQuery( Item() ).css( 'height' ) );
}
var ItemShapes = () =>
{
 return Item().find( shapes );
}
var ItemShapesDataColor = () =>
{
 return ItemShapes().attr( 'data-color' );
}
var ItemShapesDataSelected = () =>
{
 return ItemShapes().attr( 'data-selected' );
}
var DataSelectedOfShapes = () =>
{
  var DataSelectedOfShapes = shapes.split( ',' ).map( ( tag ) =>
  {
    return tag + '[ data-selected ]';
  } );
  return DataSelectedOfShapes;
}
var SlctdDdClr = () =>
{
  return jQuery( '.selected-dropdown-color' );
}
/*  Get the Color Picker panel - for adding the tabs */
var Container = () =>
{
  return SlctdDdClr().spectrum( 'container' );
}
/*  Get a shape's color-
      for syncing the active state of the design with the Color Picker */
var SelectedColor = () =>
{
  if ( SlctdDdClr().attr( 'data-color' ).includes( 'url' ) )
  {
    return SlctdDdClr().attr( 'data-color' );
  }
  else if ( SlctdDdClr().attr( 'data-color' ).includes( '#' ) )
  {
    return SlctdDdClr().attr( 'data-color' ).toUpperCase();
  }
  else
  {
    return rgb2hex( SlctdDdClr().css( 'background-color' ) );
  }
}
var SlctdShp = () =>
{
  return jQuery( '[data-selected]' );
}
var ChckSlctn = () =>
{
  console.log( "SelectedColor():" );
  console.log( SelectedColor() );
  console.log( "Item().find( FillOfShapesIs( SelectedColor() ) ):" );
  console.log( Item().find( FillOfShapesIs( SelectedColor() ) ) );
  console.log( "Item().find( DataColorOfShapesIs( SelectedColor() ) ):" );
  console.log( Item().find( DataColorOfShapesIs( SelectedColor() ) ) );
}
var SlctShp = () =>
{
  SlctdShp().removeAttr( 'data-selected' );
  // ChckSlctn();
  /*  Identify which shape is receiving the color or pattern  */
  Item().find( FillOfShapesIs( SelectedColor() ) )
    .attr( 'data-selected', true );
  Item().find( DataColorOfShapesIs( SelectedColor() ) )
    .attr( 'data-selected', true );
}
/*  Set a shape's fill and/or data-color attribute;
      also sets the data-selected attribute.  */
var SetFill = () =>
{
  SlctShp();
  /*  Find shapes with the data-color attribute set/defined  */
  if ( Item().find( '[data-selected]' ).length > 0 )
  {
    /*  Sync the dropdown-color to the shape  */
    var DataColor = () =>
    {
      if
      (
        ! SlctdShp().attr( 'fill' ).includes( 'url' ) &&
        SlctdShp().attr( 'fill' ) == SelectedColor() 
      )
      {
        return SlctdShp().attr( 'fill' );
      }
      else
      {
        return  SlctdShp().attr( 'data-color' );
      }
    }
    /*  Set the dropdown-color to the shape's "color"  */
    SlctdDdClr()
      .css( 'background-color', DataColor() )
      .attr( 'data-color', DataColor() );
    /*  Sync the shape to the dropdown-color  */
    if ( ! ItemShapes().attr( 'fill' ).includes( 'url' ) )
    {  
      // MUST ADJUST FOR IF THE PATTERN IS SET
      Item().find( DataColorOfShapes() )
       .attr( 'fill', SelectedColor() )
       .attr( 'data-color', SelectedColor() );        
    }
    else
    {
      Item().find( DataColorOfShapes() )
       .attr( 'data-color', SelectedColor() );
    }
  }
}
/*  Ensure that the SelectedColor() is consistent  */
var ColorPickerColor = () =>
{
  Container();
  var colorChangedTo = () =>
  {
    return jQuery( Container()[ 0 ] ).find( '.sp-thumb-active' )
      .attr( 'title' ).toUpperCase();
  }
  SlctdDdClr().attr( 'data-color', colorChangedTo() );
  // MUST ADJUST FOR IF THE PATTERN IS SET... Might not be needed anymore...
  //SlctdShp().attr( 'fill', colorChangedTo() );
  SetFill();
}
// Needs to be combined with ColorPickerColor()
var SetColor = ( color ) =>
{
  SlctdDdClr().attr( 'data-color', color );
  SlctdShp().attr( 'fill', color );
  SetFill();
}
/*  Add Pattern Picker - the tabs for toggling to and from and it's panel  */
jQuery( document ).on( 'select.item.design', ( event, e ) =>
{
  setTimeout( () =>
  {
    /*  To add the tabs to the color picker dialog box  */
    jQuery( '.dropdown-color' ).each( ( index, element ) =>
    {
      jQuery( element ).attr( 'data-which-color', 'color-' + index );
      jQuery( element ).attr( 'onclick', 'PatternPicker( this )' );
      jQuery( element ).on( 'move.spectrum', ( e, color ) =>
      {
        SetColor( color.toString().toUpperCase() );
      } )
      jQuery( '.sp-choose' ).attr( 'onclick', 'ColorPickerColor();' );
    } );
  }, 200 );
} );
/* The Pattern Picker tabs and panel */
var PatternPicker = ( tis ) =>
{
  jQuery( '#pp-tab, #cp-tab, #pp' ).detach();
  SlctdDdClr().removeClass( 'selected-dropdown-color' );
  jQuery( tis ).addClass( 'selected-dropdown-color' );
  Container();
  SetFill();
  /*  Finally, actually adding the tabs  */
  if ( ! jQuery( Container() ).children().hasClass( 'tab' ) )
  {
    jQuery( Container()[ 0 ] ).css( 'overflow', 'visible' );
    jQuery( Container()[ 0 ] )
      .append( '<div id="cp-tab" class="tab active-tab">Color</div>' )
      .append( '<div id="pp-tab" class="tab inactive-tab">Patten</div>' );
  }
  /*  Tab Switching/Toggling  */
  jQuery( '.tab' ).attr( 'onclick', 'TabSwitch( this )' );
  jQuery( '.sp-choose, .sp-cancel' ).click( () =>
  {
    jQuery( '#pp-tab, #cp-tab' ).detach();
    design.item.unselect();
  } );
  /*  Switch/Toggle the Pattern Picker tab on,
        if there is a pattern set  */
  if
  (
    SlctdShp().attr( 'fill' ).includes( 'url' ) &&
    SlctdShp().attr( 'data-color' ) == SelectedColor()
  )
  {
    jQuery( '#pp-tab' ).click();
    /*jQuery( '.swatch:not(.selected-swatch)' )
      .addClass( 'swatch-disabled' )
      .removeClass( 'swatch-hover' )
      .attr( 'onclick', '' );*/
    jQuery( '.remove-pattern' )
      .removeClass( 'disabled' )
      .attr( 'onclick', 'RemovePattern();ClosePicker();' );
  }
}
/*  To clear the pattern from a design  */
var RemovePattern = () =>
{
  if
  (
    SlctdShp().attr( 'data-color' ) == SelectedColor()
  )
  {
    var IdOfPatten = () =>
    {
      return SlctdShp().attr( 'fill' ).replace( 'url(', '' ).replace( ')', '' );
    }
    jQuery( IdOfPatten() ).detach();
    SlctdShp().attr( 'fill', SelectedColor() );
  }
  jQuery( '.swatch' )
    .addClass( 'swatch-hover' )
    .removeClass( 'swatch-disabled' )
    .attr( 'onclick', 'SwatchClick( this )' );
  jQuery( '.remove-pattern' )
    .addClass( 'disabled' )
    .attr( 'onclick', '' );
}
/*  Toggling/switching between tabs  */
var TabSwitch = ( tis ) =>
{
  if ( jQuery( tis ).is( '#pp-tab' ) )
  {
    jQuery( '.remove-pattern' )
      .addClass( 'disabled' )
      .attr( 'onclick', '' );
    jQuery( '.swatch' )
      .addClass( 'swatch-hover' )
      .removeClass( 'swatch-disabled' )
      .attr( 'onclick', 'SwatchClick( this )' );
    SetFill();
    jQuery( '#cp-tab' ).removeClass( 'active-tab' )
      .addClass( 'inactive-tab' );
    jQuery( '#pp-tab' ).addClass( 'active-tab' )
      .removeClass( 'inactive-tab' );
    if ( ! jQuery( '#pp' ).length >= 0 )
    {
      jQuery( Container()[ 0 ] )
        .append( '<div id="pp">' + jQuery( '#pttrns' )
          .html() + '</div>' );
    }
  }
  else
  {
    RemovePattern();
    jQuery( '#pp-tab' )
      .removeClass( 'active-tab' )
      .addClass( 'inactive-tab' );
    jQuery( '#cp-tab' )
      .addClass( 'active-tab' )
      .removeClass( 'inactive-tab' );
    jQuery( '#pp' ).detach();
  }
}
var ClosePicker = () =>
{
  jQuery( '.sp-choose' ).click();
  jQuery( '#pp' ).detach();
  jQuery( '.popover-close' ).click();
  design.item.unselect();
}
/*  Swap in new pattern - refer to pattern-picker.php  */
var SwatchClick = ( swatch ) =>
{
  /*  Grab the selected pattern  */
  var Swatch = () =>
  {
    return jQuery( swatch );
  }
  jQuery( ".selected-swatch" ).removeClass( 'selected-swatch' );
  Swatch().addClass( 'selected-swatch' );
  /*jQuery( '.swatch:not(.selected-swatch)' )
    .addClass( 'swatch-disabled' )
    .removeClass( 'swatch-hover' )
    .attr( 'onclick', '' );*/
  var PatternID = () =>
  {
    return 'pattern-' + Item().attr( 'id' ) + '-' + Swatch().attr( 'id' );
  }
  /*  Create a pattern DOM element,
        to be inserted into the design element(s)  */
  var Pattern = () =>
  {
    var pattern = jQuery( document.createElement( 'pattern' ) );
    pattern.attr( 'id' , PatternID() );
    pattern.addClass( Swatch().attr( 'id' ) );
    /*  Insert the selected pattern into the new pattern element  */
    jQuery( Swatch().find( shapes ) ).each( ( index, element ) =>
    {
      jQuery( element ).attr( 'data-which-shape', 'shape-' + index );
      /*  For removal from the color list,
            ( ../assets/js/design.js 4201 )
            as in not becoming one of the dropdown colors  */
      jQuery( element ).attr( 'data-of-pattern', true );
      pattern.append( jQuery( element ).clone() );
    } );
    // PATTERN SIZING NEED TO BE TESTED MORE... x by x, y by x, y by y, x by x
    var PatternHeight = () =>
    {
      //console.log( pattern.children().filter( ':lt(1)' ).width() );
      return Swatch().find( 'svg' ).height();
    }
    var PatternWidth = () =>
    {
      return Swatch().find( 'svg' ).width();
    }
    var PatternMaxDim = () =>
    {
      return PatternWidth() >= PatternHeight() ? PatternWidth() : PatternHeight();
    }
    var ItemMaxDim = () =>
    {
      return ItemWidth() >= ItemHeight() ? ItemWidth() : ItemHeight();
    }
    var Ratio = () =>
    {
      return ( ItemMaxDim() / PatternMaxDim() ) * 1.0467;
    }
    /*  Set the new pattern element's dimensions  */
    pattern.attr( 'height', PatternHeight() );
    pattern.attr( 'width', PatternWidth() );
    pattern.attr( 'patternUnits', 'userSpaceOnUse' );
    pattern.attr( 'patternTransform', 'scale( ' + Ratio() + ' )' );
    return pattern;
  }
  var PatternWrapper = () =>
  {
    return Pattern()[ 0 ].outerHTML;
  }
  var Defs = () =>
  {
    var defs = jQuery( document.createElement( 'defs' ) );
    defs.innerHTML = PatternWrapper();
    return defs;
  }
  /*  Get the design elements that will receive the pattern,
        that had previous pattern set  */
  if ( ItemShapesDataColor() == SelectedColor() )
  {
    Item().find( DataColorOfShapesIs( SelectedColor() ) )
      .attr( 'fill', 'url(#' + PatternID() + ' )' )
      .attr( 'data-color', SelectedColor() );
  }
  /*  Get the design elements that will receive the pattern,
        that did not have a pattern previously  */
  else
  {
    Item().find( FillOfShapesIs( SelectedColor() ) )
      /*  Set their fill attribute  */
      .attr( 'fill', 'url(#' + PatternID() + ' )' )
      .attr( 'data-color', SelectedColor() );
  }
  SetFill();
  /*  Insert the new pattern element into the design elements  */
  if ( Item().find( 'defs' ).length == 0 )
  {
    Item().find( 'svg' ).append( Defs() );
  }
  if ( Item().find( 'defs' ).length != 0 )
  {
    Item().find( '.' + Swatch().attr( 'id' ) ).remove();
    Item().find( 'defs' ).append( Defs().innerHTML );
  }
  var Svg = () =>
  {
    return Item().find( 'svg' )[ 0 ];
  }
  var svgContents = () =>
  {
    return Svg().innerHTML;
  }
  Svg().innerHTML = svgContents();
  /*setTimeout( () =>
  {
    ClosePicker();
  }, 250 );*/
}
