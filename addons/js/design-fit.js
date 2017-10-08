/**
 * @author tshirtecommerce - www.tshirtecommerce.com
 * @date: 2016-05-10
 * 
 * @copyright  Copyright (C) 2015 tshirtecommerce.com. All rights reserved.
 * @license   GNU General Public License version 2 or later; see LICENSE
 *
 */
jQuery(document).ready(function() {
	jQuery('#design-area .labView').each(function() {
		jQuery(this).append('<div class="fitErrorMess" style="display:none; position: absolute; width: 100%; top: 40px; color: red; font-weight: bold;"><span>' + fitItemErrMss + '</span></div>');
		jQuery(this).append('<div class="fitWarnMess" style="display:none; position: absolute; width: 100%; top: 40px; color: blue; font-weight: bold;"><span>' + fitItemWarnMss + '</span></div>');
	});
});
jQuery(document).on('after.create.item.design', function(event, span) {
	checkFitDesign();
});
jQuery(document).on('info.size.design', function(event, type, width, height) {
	checkFitDesign();
});
jQuery(document).on('afterchangesize.item.design', function(event, width, height) {
	checkFitDesign();
});
jQuery(document).on('select.item.design', function(event, e){
	var item = jQuery(e).parents('.labView').find('.mask-item');
	var recoupLeft = 0, recoupTop = 0;
	item.draggable({
		start: function( event, ui ){
			var t = design.convert.px(jQuery(this).css('top'));
			var l = design.convert.px(jQuery(this).css('left'));
			t = isNaN(t) ? 0 : t;
			l = isNaN(l) ? 0 : l;
			recoupLeft = l - ui.position.left;
			recoupTop  = t - ui.position.top;
		},
		drag:function(event, ui){
			ui.position.left += recoupLeft;
			ui.position.top  += recoupTop;
			jQuery(e).css('left', ui.position.left);
			jQuery(e).css('top', ui.position.top);
			checkFitDesign();
		}
	});
});
jQuery(document).on('size.update.text.design', function(event, w, h) {
	checkFitDesign();
});
jQuery(document).on('move.tool.design', function(event, e) {
	checkFitDesign();
});
jQuery(document).on('beforechangefont.item.design', function(event, w, h) {
	checkFitDesign();
});
jQuery(document).on('checkItem.item.design', function(event, check) {
	if(checkItemFitType == '1')
	{
		return false;
	}
	if(jQuery('.labView.active .fitErrorMess').css('display') != 'none')
	{
		alert(fitItemErrMss);
		check.status = false;
		check.callback = '';
	}
});
jQuery(document).on('product.change.design', function(event, p) {
	jQuery('.labView.active .fitErrorMess').css('display', 'none');
	jQuery('.labView.active .fitWarnMess').css('display', 'none');
	jQuery('.labView.active .design-area').css('border-color', '#666');
	if(event.namespace == 'change.design');
	{
		checkItemFitFlg  = p.productCheckItemFitFlg != undefined ? p.productCheckItemFitFlg : '0';
		checkItemFitType = p.productCheckItemFitType != undefined ? p.productCheckItemFitType : '1';
	}
	checkFitDesign();
});
jQuery(document).on('remove.item.design', function(event, e) {
	checkFitDesign();
});
design.item.mask.rotate = function(el, angle) {
	el.css('transform','rotate(' + angle + 'rad)');
	el.css('-moz-transform','rotate(' + angle + 'rad)');
	el.css('-webkit-transform','rotate(' + angle + 'rad)');
	el.css('-o-transform','rotate(' + angle + 'rad)');
	checkFitDesign();
};
var checkFitDesign = function(e) {
        if(jQuery(this).hasClass('isShape')){
            console.log('test shape');
            return;
        }
        
        if(jQuery('.isShape').length == 0){
            //console.log('no shape');
            return;
        }
    
	var designArea = jQuery('.labView.active .design-area');
	var rectDesign = designArea[0].getBoundingClientRect();
	var check = false;

	if(checkItemFitFlg == '0')
	{
		return;
	}
	jQuery('.labView.active .design-area .content-inner').children('span').each(function() {
		var rectItem  = this.getBoundingClientRect();
		if(jQuery(this).data('type') == 'clipart')
		{
			var img = jQuery(this).find('image');
			if(img.length > 0)
			{
				if(img.css('clip-path') != 'none')
				{
					return;
				}
			}
		}
		if(rectItem.top < rectDesign.top)
		{
			check = true;
		}
		if(rectItem.left < rectDesign.left)
		{
			check = true;
		}
		if(rectItem.bottom > rectDesign.bottom)
		{
			check = true;
		}
		if(rectItem.right > rectDesign.right)
		{
			check = true;
		}
	});
	if(check)
	{
		if(checkItemFitType == '0')
		{
			designArea.css('border-color', 'red');
			jQuery('.labView.active').find('.fitErrorMess').css('display', 'block');
		}
		else
		{
			designArea.css('border-color', 'blue');
			jQuery('.labView.active').find('.fitWarnMess').css('display', 'block');
		}
	}
	else
	{
		designArea.css('border-color', '#666');
		jQuery('.labView.active').find('.fitErrorMess').css('display', 'none');
		jQuery('.labView.active').find('.fitWarnMess').css('display', 'none');
	}
	return check;
}
