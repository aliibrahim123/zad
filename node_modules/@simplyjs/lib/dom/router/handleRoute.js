//route handler
//the core operation

import { query } from '../base.js';
import { checkel } from './check.js';

export var handleRoute = (router, url) => {
	var { events, lastUrl, opts } = router;
	
	//if not same path, update the dom
	if (url.pathname !== lastUrl.pathname) startUpdate(router, events, opts, url);
	
	//if url has hash, scroll to it
	else if (url.hash) handleHash(url, events);
	
	//else scroll to top
	else setTimeout(() => scroll(0, 0), 0);
}

var startUpdate = async (router, events, opts, url) => {
	events.trigger('before-fetch', router, url);
	
	//fetch page
	var response = await fetch(url).then(v => v, v => v);
	
	events.trigger('after-fetch', router, url, response);
	
	//handle error
	if (response instanceof Error || !response.ok) return handleError(router, response, url, events);
	
	//generate page
	var page = await response.text();
	page = (new DOMParser()).parseFromString(page, 'text/html');
	
	//update history when required (not in back/forward)
	if (url !== location) history.pushState(history.state, document.title, url.href);
	
	//handle update
	if (opts.transitions && document.startViewTransition) document.startViewTransition(() => handleUpdate(router, page, events, url));
	else handleUpdate(router, page, events, url)
}

var handleUpdate = (router, page, events, url) => {
	events.trigger('before-update', router, page, url);
	
	//handle head
	handleHead(page);
	
	//replace body
	//handle preserved nodes
	query('[preserve-on-route]', document.body).forEach(
		el => query('[preserve-on-route][id=' + el.id + ']', page.body)[0]?.replaceWith?.(el)
	);
	document.body.replaceChildren(...page.body.childNodes);
	
	events.trigger('after-update', router, url);
	
	//if url has hash, scroll
	if (url.hash) setTimeout(()=>query(url.hash)[0]?.scrollIntoView?.({behavior: 'smooth'}), 1);
	
	//reatach to dom
	router.attachToDom();
}

var handleError = (router, response, url, events) => {
	//generate page and replace page with
	var el = router.opts.errorPage(response, url);
	checkel(el, 'error page');
	document.body.replaceChildren(el);
	
	//fire error event
	events.trigger('error', router, url, response);
	
	//update history
	history.pushState(history.state, response instanceof Error ? response.name : response.statusText, url.href);
}

var handleHash = (url, events) => {
	var hashEl = query(url.hash)[0];
		
	if (hashEl) setTimeout(()=>hashEl.scrollIntoView({behavior: 'smooth'}), 1);
	
	//update history when required (not in back/forward)
	if (url !== location) history.pushState(history.state, document.title, url.href)
}

var groupElsByTagName = (els) => els.reduce((obj, el) => {
	if (obj[el.tagName]) obj[el.tagName].push(el);
	else obj[el.tagName] = [el];
	return obj
}, {});

var clone = (el) => {
	var cloned = document.createElement(el.tagName.toLowerCase());
	Array.from(el.attributes).forEach(attr => cloned.setAttribute(attr.name, attr.value));
	return cloned
}

var handleHead = (page) => {
	//base element: remove if added before then prepend if specified
	//script and preserve-on-route elements: add if not added before
	//other elements: remove old then add new
	var head = document.head;
	
	//group by tag name
	var oldHeadEls = groupElsByTagName(Array.from(head.children));
	var newHeadEls = groupElsByTagName(Array.from(page.head.children));
	
	//handle base element
	if (oldHeadEls.BASE) oldHeadEls.BASE[0].remove();
	if (newHeadEls.BASE) head.prepend(newHeadEls.BASE[0]);
	
	//walk through all tags (old and new)
	new Set(Object.keys(oldHeadEls).concat(Object.keys(newHeadEls))).forEach(tag => {
		if (tag === 'BASE') return;
		
		//if script/link, walk through news and append if not added before
		if (tag === 'SCRIPT') return newHeadEls.SCRIPT.forEach(
			nEl => !oldHeadEls.SCRIPT.some(oEl => oEl.id === nEl.id) && head.append(clone(nEl))
		);
		
		//remove old elements
		if (oldHeadEls[tag]) oldHeadEls[tag].forEach(el => !el.hasAttribute('preserve-on-route') && el.remove());
		
		//add new elements
		if (newHeadEls[tag]) newHeadEls[tag].forEach(el => {
			if (el.hasAttribute('preserve-on-route') && oldHeadEls[tag]?.some?.(oEl => oEl.id === el.id)) return;
			head.append(el)
		});
	})
}