const DEFAULT_CATEGORIES = [
  {id:'cat1',name:'Appetizers',emoji:'🥘',description:'Small bites to start your meal'},
  {id:'cat2',name:'Soups & Salads',emoji:'🥗',description:'Fresh, light, and comforting'},
  {id:'cat3',name:'Main Course',emoji:'🍝',description:'The heart of your dining experience'},
  {id:'cat4',name:'Pizzas',emoji:'🍕',description:'Oven-baked favourites'},
  {id:'cat5',name:'Burgers',emoji:'🍔',description:'Stacked, juicy, and satisfying'},
  {id:'cat6',name:'Desserts',emoji:'🍰',description:'A sweet finish to your meal'},
  {id:'cat7',name:'Beverages',emoji:'🍹',description:'Refreshing sips, hot or cold'},
  {id:'cat8',name:'Specials',emoji:'✨',description:"Chef's seasonal creations"}
];
const TAGS = ['Vegetarian','Non-Vegetarian','Vegan','Gluten-Free','Dairy-Free','Spicy',"Chef's Special"];
const seedItems = [
 {id:'i1',name:'Truffle Mushroom Pasta',description:'Creamy parmesan sauce, wild mushrooms, fresh herbs.',price:349,category:'Main Course',tags:['Vegetarian',"Chef's Special"],status:'Available',discount:0,emoji:'🍝',image:'',popular:284},
 {id:'i2',name:'Classic Margherita Pizza',description:'San Marzano tomato, mozzarella, basil, olive oil.',price:299,category:'Pizzas',tags:['Vegetarian'],status:'Available',discount:10,emoji:'🍕',image:'',popular:246},
 {id:'i3',name:'Smoky BBQ Burger',description:'Grilled patty, smoky barbecue glaze, crisp lettuce.',price:279,category:'Burgers',tags:['Non-Vegetarian','Dairy-Free'],status:'Available',discount:0,emoji:'🍔',image:'',popular:218},
 {id:'i4',name:'Garden Harvest Salad',description:'Seasonal greens, cherry tomatoes, citrus vinaigrette.',price:199,category:'Soups & Salads',tags:['Vegan','Gluten-Free'],status:'Available',discount:0,emoji:'🥗',image:'',popular:176},
 {id:'i5',name:'Velvet Chocolate Cake',description:'Dark chocolate sponge with silky ganache.',price:189,category:'Desserts',tags:['Vegetarian',"Chef's Special"],status:'Limited Stock',discount:15,emoji:'🍰',image:'',popular:164},
 {id:'i6',name:'Golden Crispy Fries',description:'Hand-cut potatoes, sea salt, house seasoning.',price:129,category:'Appetizers',tags:['Vegan','Gluten-Free'],status:'Available',discount:0,emoji:'🍟',image:'',popular:153},
 {id:'i7',name:'Mango Mint Cooler',description:'Fresh mango, mint, lime, and sparkling water.',price:149,category:'Beverages',tags:['Vegan','Gluten-Free'],status:'Available',discount:0,emoji:'🍹',image:'',popular:142},
 {id:'i8',name:'Chef’s Paneer Tikka',description:'Smoky paneer, peppers, warming house spices.',price:259,category:'Specials',tags:['Vegetarian','Spicy',"Chef's Special"],status:'New Item',discount:0,emoji:'🍢',image:'',popular:127},
 {id:'i9',name:'Roasted Tomato Soup',description:'Slow-roasted tomatoes, basil oil, toasted croutons.',price:159,category:'Soups & Salads',tags:['Vegetarian'],status:'Limited Stock',discount:0,emoji:'🍲',image:'',popular:98},
 {id:'i10',name:'Herb Grilled Chicken',description:'Tender chicken, garden herbs, seasonal vegetables.',price:389,category:'Main Course',tags:['Non-Vegetarian','Gluten-Free'],status:'Available',discount:5,emoji:'🍗',image:'',popular:119},
 {id:'i11',name:'Classic Tiramisu',description:'Espresso-soaked layers with mascarpone cream.',price:219,category:'Desserts',tags:['Vegetarian'],status:'Out of Stock',discount:0,emoji:'🍮',image:'',popular:91},
 {id:'i12',name:'Lemon Iced Tea',description:'Black tea, fresh lemon, a hint of sweetness.',price:99,category:'Beverages',tags:['Vegan','Gluten-Free'],status:'Available',discount:0,emoji:'🧋',image:'',popular:88}
];
const seedInventory = [
 {id:'inv1',name:'Mozzarella cheese',qty:3,unit:'kg',reorder:5},{id:'inv2',name:'Fresh mushrooms',qty:2,unit:'kg',reorder:4},
 {id:'inv3',name:'Burger buns',qty:18,unit:'pcs',reorder:12},{id:'inv4',name:'Tomatoes',qty:8,unit:'kg',reorder:5},
 {id:'inv5',name:'Chicken breast',qty:0,unit:'kg',reorder:3},{id:'inv6',name:'Potatoes',qty:14,unit:'kg',reorder:6},
 {id:'inv7',name:'Fresh mint',qty:1,unit:'bunch',reorder:3},{id:'inv8',name:'Dark chocolate',qty:4,unit:'kg',reorder:2}
];
const readStore=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem('menupro_'+key));return v??fallback}catch{return fallback}};
let categories=readStore('categories',DEFAULT_CATEGORIES);
let items=readStore('items',seedItems);
let inventory=readStore('inventory',seedInventory);
let versions=readStore('versions',[]);
let digitalCategory='All';
let toastTimer;
const $=id=>document.getElementById(id);
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>{localStorage.setItem('menupro_categories',JSON.stringify(categories));localStorage.setItem('menupro_items',JSON.stringify(items));localStorage.setItem('menupro_inventory',JSON.stringify(inventory));localStorage.setItem('menupro_versions',JSON.stringify(versions));};
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function categoryFor(item){return categories.find(c=>c.name===item.category)||{emoji:'🍽️',name:item.category||'Uncategorized'}}
function statusClass(status){return status==='Available'?'status-available':status==='Limited Stock'?'status-limited':status==='Out of Stock'?'status-out':'status-new'}
function tagClass(tag){return 'tag-'+tag.toLowerCase().replace(/[^a-z]+/g,'-').replace(/-$/,'')}
function tagsHTML(tags=[]){return tags.length?tags.map(t=>`<span class="tag-pill ${tagClass(t)}">${esc(t)}</span>`).join(''):'<span class="muted">—</span>'}
function imageHTML(item,extra=''){if(item.image){return `<div class="${extra||'food-thumb'}"><img src="${esc(item.image)}" alt="${esc(item.name)}" onerror="this.parentElement.textContent='${item.emoji||'🍽️'}'"></div>`}return `<div class="${extra||'food-thumb'}">${item.emoji||'🍽️'}</div>`}
function renderDashboard(){
 $('statItems').textContent=items.length;$('statCategories').textContent=categories.length;
 const available=items.filter(i=>i.status==='Available').length;$('statAvailable').innerHTML=(items.length?Math.round(available/items.length*100):0)+'<span class="unit">%</span>';
 const low=inventory.filter(i=>i.qty<=i.reorder).length;$('statLow').textContent=low;$('stockBadge').textContent=low;
 const popular=[...items].sort((a,b)=>(b.popular||0)-(a.popular||0)).slice(0,4);
 $('popularList').innerHTML=popular.map(i=>`<div class="popular-item">${imageHTML(i)}<div class="popular-info"><b>${esc(i.name)}</b><small>${esc(i.category)} · ${i.popular||0} orders</small></div><span class="popular-price">${money(i.price)}</span></div>`).join('')||'<div class="empty-state">Add items to see popular dishes.</div>';
 const alerts=inventory.filter(i=>i.qty<=i.reorder).slice(0,3);
 $('dashboardAlerts').innerHTML=alerts.map(i=>`<div class="alert-row"><span class="alert-symbol">!</span><div><b>${esc(i.name)} ${i.qty===0?'is out of stock':'running low'}</b><p>${i.qty} ${esc(i.unit)} remaining · Reorder at ${i.reorder} ${esc(i.unit)}</p></div></div>`).join('')||'<div class="empty-state">All ingredients are well stocked. Great work!</div>';
}
function renderCategories(){
 $('categoryGrid').innerHTML=categories.map(c=>{const count=items.filter(i=>i.category===c.name).length;return `<article class="category-card"><div class="category-emoji">${c.emoji||'🍽️'}</div><h2>${esc(c.name)}</h2><p>${esc(c.description||'A delicious menu collection')}</p><div class="category-bottom"><span>${count} menu item${count===1?'':'s'}</span><span class="category-actions"><button class="mini-action" data-category-edit="${c.id}" title="Edit category">✎</button><button class="mini-action" data-category-delete="${c.id}" title="Delete category">×</button></span></div></article>`}).join('');
 if(!categories.length)$('categoryGrid').innerHTML='<div class="empty-state">No categories yet. Add your first category.</div>';
 const filter=$('categoryFilter'), current=filter.value;
 filter.innerHTML='<option value="">All categories</option>'+categories.map(c=>`<option>${esc(c.name)}</option>`).join('');
 if(categories.some(c=>c.name===current))filter.value=current;
 $('itemCategory').innerHTML=categories.map(c=>`<option>${esc(c.name)}</option>`).join('');
}
function filteredItems(){const q=($('itemSearch')?.value||'').trim().toLowerCase(),cat=$('categoryFilter')?.value||'',status=$('statusFilter')?.value||'';return items.filter(i=>(!q||[i.name,i.description,i.category,...(i.tags||[])].join(' ').toLowerCase().includes(q))&&(!cat||i.category===cat)&&(!status||i.status===status))}
function renderItems(){
 const rows=filteredItems();
 $('itemsTable').innerHTML=rows.map(i=>`<tr><td><div class="item-cell">${imageHTML(i)}<div><b>${esc(i.name)}</b><small>${esc(i.description||'No description added')}</small></div></div></td><td>${esc(i.category)}</td><td><span class="price">${money(i.price)}</span></td><td>${tagsHTML(i.tags)}</td><td><span class="status-pill ${statusClass(i.status)}">${esc(i.status)}</span></td><td><button class="mini-action" data-item-edit="${i.id}" title="Edit">✎</button><button class="mini-action" data-item-delete="${i.id}" title="Delete">×</button></td></tr>`).join('');
 if(!rows.length)$('itemsTable').innerHTML='<tr><td colspan="6" class="empty-state">No menu items match your search.</td></tr>';
 $('itemCountLabel').textContent=`Showing ${rows.length} of ${items.length} menu items`;
}
function renderDigital(){
 const filters=['All',...categories.map(c=>c.name)];
 $('digitalFilters').innerHTML=filters.map(c=>`<button class="filter-chip ${digitalCategory===c?'active':''}" data-digital-cat="${esc(c)}">${c==='All'?'All dishes':esc(c)}</button>`).join('');
 const q=($('digitalSearch').value||'').trim().toLowerCase();
 const shown=items.filter(i=>(digitalCategory==='All'||i.category===digitalCategory)&&(!q||`${i.name} ${i.description} ${(i.tags||[]).join(' ')}`.toLowerCase().includes(q))&&i.status!=='Out of Stock');
 $('digitalGrid').innerHTML=shown.map(i=>`<article class="digital-card"><div class="digital-image">${i.image?`<img src="${esc(i.image)}" alt="${esc(i.name)}" onerror="this.remove()">`:i.emoji||'🍽️'}<span class="status-pill ${statusClass(i.status)}">${i.status==='New Item'?'NEW':i.status==='Limited Stock'?'LIMITED':'AVAILABLE'}</span></div><div class="digital-card-body"><div class="digital-card-top"><h2>${esc(i.name)}</h2><span class="dish-price">${money(i.price*(1-(i.discount||0)/100))}</span></div><p>${esc(i.description||'Prepared fresh in our kitchen.')}</p><div class="digital-tags">${tagsHTML(i.tags)}</div></div></article>`).join('');
 if(!shown.length)$('digitalGrid').innerHTML='<div class="empty-state">No dishes found. Try another search or category.</div>';
}
function renderPricing(){
 $('pricingTable').innerHTML=items.map(i=>{const offer=i.discount?Math.round(i.price*(1-i.discount/100)):null;return `<tr><td>${i.emoji||'🍽️'} &nbsp;${esc(i.name)}</td><td>${money(i.price)}</td><td>${offer?`<span class="price">${money(offer)}</span>`:'—'}</td><td>${i.discount?`<span class="tag-pill tag-spicy">${i.discount}% off</span>`:'—'}</td><td><button class="mini-action" data-price-edit="${i.id}">Edit price</button></td></tr>`}).join('');
 $('offerCount').textContent=items.filter(i=>i.discount>0).length;
}
function renderInventory(){
 $('ingredientCount').textContent=inventory.length;$('lowStockCount').textContent=inventory.filter(i=>i.qty>0&&i.qty<=i.reorder).length;$('outStockCount').textContent=inventory.filter(i=>i.qty===0).length;
 $('inventoryTable').innerHTML=inventory.map(i=>{const state=i.qty===0?'Out of Stock':i.qty<=i.reorder?'Low Stock':'In Stock';const cls=i.qty===0?'status-out':i.qty<=i.reorder?'status-limited':'status-available';return `<tr><td>${esc(i.name)}</td><td><b>${i.qty}</b> ${esc(i.unit)}</td><td>${i.reorder} ${esc(i.unit)}</td><td><span class="status-pill ${cls}">${state}</span></td><td><div class="stock-control"><button data-stock="${i.id}" data-delta="-1" aria-label="Decrease stock">−</button><span>${i.qty}</span><button data-stock="${i.id}" data-delta="1" aria-label="Increase stock">＋</button><button class="mini-action" data-stock-edit="${i.id}" title="Edit ingredient">✎</button></div></td></tr>`}).join('');
}
function renderAnalytics(){
 const avg=items.length?Math.round(items.reduce((a,i)=>a+i.price,0)/items.length):0;$('averagePrice').textContent=money(avg);
 const popular=[...items].sort((a,b)=>(b.popular||0)-(a.popular||0)).slice(0,5);
 $('analyticsPopular').innerHTML=popular.map((i,n)=>`<div class="rank-row"><span class="rank-number">0${n+1}</span>${imageHTML(i)}<div class="rank-info"><b>${esc(i.name)}</b><small>${esc(i.category)}</small></div><span class="rank-value">${i.popular||0} orders</span></div>`).join('');
 const countTag=tag=>items.filter(i=>(i.tags||[]).includes(tag)).length;
 const mixes=[['Vegetarian',countTag('Vegetarian')],['Vegan',countTag('Vegan')],['Non-Vegetarian',countTag('Non-Vegetarian')],['Gluten-Free',countTag('Gluten-Free')]];
 $('dietMix').innerHTML=mixes.map(([name,n])=>`<div class="diet-line"><span>${name}</span><div class="diet-track"><i style="width:${items.length?Math.round(n/items.length*100):0}%"></i></div><b>${n}</b></div>`).join('');
}
function renderVersions(){
 $('versionReportCount').textContent=`${versions.length} version${versions.length===1?'':'s'}`;
 $('versionList').innerHTML=versions.length?[...versions].reverse().map(v=>`<article class="version-card"><span class="version-dot"></span><div class="version-info"><b>${esc(v.name)}</b><p>${new Date(v.date).toLocaleString()} · ${v.items.length} items · ${v.categories.length} categories</p></div><div class="version-actions"><button class="btn btn-outline" data-version-restore="${v.id}">Restore</button><button class="mini-action" data-version-delete="${v.id}" title="Delete snapshot">×</button></div></article>`).join(''):'<div class="panel empty-state">No snapshots saved yet. Save one before making a major menu change.</div>';
}
function renderAll(){renderDashboard();renderCategories();renderItems();renderDigital();renderPricing();renderInventory();renderAnalytics();renderVersions();save()}
function openItemModal(item=null){
 $('itemForm').reset();$('editItemId').value=item?.id||'';$('modalTitle').textContent=item?'Edit menu item':'Add menu item';
 $('itemName').value=item?.name||'';$('itemDescription').value=item?.description||'';$('itemPrice').value=item?.price??'';$('itemImage').value=item?.image||'';$('itemStatus').value=item?.status||'Available';$('itemDiscount').value=item?.discount||0;
 if(item&&categories.some(c=>c.name===item.category))$('itemCategory').value=item.category;
 $('tagOptions').innerHTML=TAGS.map(t=>`<label class="tag-check"><input type="checkbox" value="${esc(t)}" ${(item?.tags||[]).includes(t)?'checked':''}> ${esc(t)}</label>`).join('');
 $('modalBackdrop').hidden=false;$('itemName').focus();
}
function closeModal(){$('modalBackdrop').hidden=true}
function addCategory(){
 const name=prompt('Category name (e.g. Breakfast):');if(!name||!name.trim())return;
 const clean=name.trim();if(categories.some(c=>c.name.toLowerCase()===clean.toLowerCase()))return toast('That category already exists.');
 const emoji=prompt('Choose an emoji for this category:','🍽️')||'🍽️';const description=prompt('Short description:','Freshly prepared favourites')||'';
 categories.push({id:'cat'+Date.now(),name:clean,emoji,description});renderAll();toast('Category added.');
}
function editCategory(id){
 const c=categories.find(c=>c.id===id);if(!c)return;
 const name=prompt('Update category name:',c.name);if(!name||!name.trim())return;
 const clean=name.trim();if(categories.some(x=>x.id!==id&&x.name.toLowerCase()===clean.toLowerCase()))return toast('That category already exists.');
 const old=c.name;c.name=clean;c.emoji=prompt('Update category emoji:',c.emoji)||c.emoji;c.description=prompt('Update description:',c.description)||c.description;
 items.forEach(i=>{if(i.category===old)i.category=clean});renderAll();toast('Category updated.');
}
function deleteCategory(id){
 const c=categories.find(c=>c.id===id);if(!c)return;
 const linked=items.filter(i=>i.category===c.name).length;
 if(!confirm(`Delete "${c.name}"?${linked?` ${linked} menu item(s) will become Uncategorized.`:''}`))return;
 items.forEach(i=>{if(i.category===c.name)i.category='Uncategorized'});categories=categories.filter(x=>x.id!==id);renderAll();toast('Category deleted.');
}
function exportCSV(filename,rows){
 const csv=rows.map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
 const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast(`${filename} exported.`);
}
function exportMenu(){exportCSV('menupro-menu.csv',[['Name','Description','Price INR','Category','Dietary Tags','Status','Discount %'],...items.map(i=>[i.name,i.description,i.price,i.category,(i.tags||[]).join('; '),i.status,i.discount||0])])}
function exportInventory(){exportCSV('menupro-inventory.csv',[['Ingredient','Quantity','Unit','Reorder Level','Status'],...inventory.map(i=>[i.name,i.qty,i.unit,i.reorder,i.qty===0?'Out of Stock':i.qty<=i.reorder?'Low Stock':'In Stock'])])}
function exportVersions(){const blob=new Blob([JSON.stringify(versions,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='menupro-version-history.json';a.click();URL.revokeObjectURL(url);toast('Version history exported.')}
function saveVersion(){versions.push({id:'v'+Date.now(),name:'Menu snapshot '+(versions.length+1),date:new Date().toISOString(),items:JSON.parse(JSON.stringify(items)),categories:JSON.parse(JSON.stringify(categories))});renderVersions();save();toast('Menu snapshot saved.')}
function restoreVersion(id){const v=versions.find(x=>x.id===id);if(!v)return;if(!confirm(`Restore "${v.name}"? Your current menu will be replaced.`))return;items=JSON.parse(JSON.stringify(v.items));categories=JSON.parse(JSON.stringify(v.categories));renderAll();toast('Menu snapshot restored.')}
function searchEverywhere(q){if(!q.trim())return;showPage('items');$('itemSearch').value=q;$('globalSearch').value=q;renderItems()}
function showPage(id){const target=$(id);if(!target)return;document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));$('currentPage').textContent=target.querySelector('h1')?.textContent||'Dashboard';if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);$('sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'})}
document.addEventListener('click',e=>{
 const nav=e.target.closest('.nav-link');if(nav){e.preventDefault();showPage(nav.getAttribute('href').slice(1));return}
 const edit=e.target.closest('[data-item-edit]');if(edit){openItemModal(items.find(i=>i.id===edit.dataset.itemEdit));return}
 const del=e.target.closest('[data-item-delete]');if(del){const i=items.find(i=>i.id===del.dataset.itemDelete);if(i&&confirm(`Delete "${i.name}" from the menu?`)){items=items.filter(x=>x.id!==i.id);renderAll();toast('Menu item deleted.')}return}
 const catEdit=e.target.closest('[data-category-edit]');if(catEdit){editCategory(catEdit.dataset.categoryEdit);return}
 const catDel=e.target.closest('[data-category-delete]');if(catDel){deleteCategory(catDel.dataset.categoryDelete);return}
 const digital=e.target.closest('[data-digital-cat]');if(digital){digitalCategory=digital.dataset.digitalCat;renderDigital();return}
 const stock=e.target.closest('[data-stock]');if(stock){const i=inventory.find(i=>i.id===stock.dataset.stock);if(i){i.qty=Math.max(0,i.qty+Number(stock.dataset.delta));renderAll()}return}
 const stockEdit=e.target.closest('[data-stock-edit]');if(stockEdit){const i=inventory.find(i=>i.id===stockEdit.dataset.stockEdit);if(!i)return;const name=prompt('Ingredient name:',i.name);if(name===null)return;const qty=prompt(`Quantity in ${i.unit}:`,i.qty);if(qty===null||!Number.isFinite(Number(qty))||Number(qty)<0)return toast('Enter a valid quantity.');const reorder=prompt('Reorder level:',i.reorder);if(reorder===null||!Number.isFinite(Number(reorder))||Number(reorder)<0)return toast('Enter a valid reorder level.');i.name=name.trim()||i.name;i.qty=Number(qty);i.reorder=Number(reorder);renderAll();toast('Ingredient updated.');return}
 const priceEdit=e.target.closest('[data-price-edit]');if(priceEdit){const i=items.find(i=>i.id===priceEdit.dataset.priceEdit);if(!i)return;const price=prompt(`Regular price for ${i.name} (₹):`,i.price);if(price===null||!Number.isFinite(Number(price))||Number(price)<0)return toast('Enter a valid price.');const discount=prompt('Discount percentage (0–90):',i.discount||0);if(discount===null||!Number.isFinite(Number(discount))||Number(discount)<0||Number(discount)>90)return toast('Enter a discount between 0 and 90.');i.price=Number(price);i.discount=Number(discount);renderAll();toast('Pricing updated.');return}
 const restore=e.target.closest('[data-version-restore]');if(restore){restoreVersion(restore.dataset.versionRestore);return}
 const versionDel=e.target.closest('[data-version-delete]');if(versionDel){if(confirm('Delete this snapshot?')){versions=versions.filter(v=>v.id!==versionDel.dataset.versionDelete);renderVersions();save();toast('Snapshot deleted.')}return}
});
$('itemForm').addEventListener('submit',e=>{
 e.preventDefault();const id=$('editItemId').value;const existing=items.find(i=>i.id===id);
 const tags=[...$('tagOptions').querySelectorAll('input:checked')].map(x=>x.value);
 const item={id:id||'i'+Date.now(),name:$('itemName').value.trim(),description:$('itemDescription').value.trim(),price:Number($('itemPrice').value),category:$('itemCategory').value||'Uncategorized',image:$('itemImage').value.trim(),tags,status:$('itemStatus').value,discount:Number($('itemDiscount').value)||0,emoji:existing?.emoji||'🍽️',popular:existing?.popular||0};
 if(!item.name)return toast('Please enter an item name.');
 if(existing)items=items.map(i=>i.id===id?item:i);else items.unshift(item);
 closeModal();renderAll();toast(existing?'Menu item updated.':'Menu item added.');
});
$('addItemBtn').addEventListener('click',()=>openItemModal());$('quickAdd').addEventListener('click',()=>openItemModal());
$('closeModal').addEventListener('click',closeModal);$('cancelModal').addEventListener('click',closeModal);
$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeModal()});
$('addCategoryBtn').addEventListener('click',addCategory);
$('itemSearch').addEventListener('input',renderItems);$('categoryFilter').addEventListener('change',renderItems);$('statusFilter').addEventListener('change',renderItems);
$('digitalSearch').addEventListener('input',renderDigital);
$('globalSearch').addEventListener('input',e=>{if(e.target.value.trim().length>1)searchEverywhere(e.target.value)});
$('globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter')searchEverywhere(e.target.value)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('globalSearch').focus()}});
$('menuToggle').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('menupro_dark',document.body.classList.contains('dark')?'1':'0');$('themeToggle').textContent=document.body.classList.contains('dark')?'☀':'☾'});
if(localStorage.getItem('menupro_dark')==='1'){document.body.classList.add('dark');$('themeToggle').textContent='☀'}
$('printMenu').addEventListener('click',()=>{showPage('digital-menu');window.print()});
$('exportMenu').addEventListener('click',exportMenu);$('exportInventory').addEventListener('click',exportInventory);$('exportVersions').addEventListener('click',exportVersions);
$('exportAnalytics').addEventListener('click',()=>exportCSV('menupro-analytics.csv',[['Item','Category','Price INR','Sample orders','Status'],...items.map(i=>[i.name,i.category,i.price,i.popular||0,i.status])]));
$('saveVersion').addEventListener('click',saveVersion);
$('newOfferBtn').addEventListener('click',()=>{const name=prompt('Which menu item should have an offer?\\n'+items.map(i=>i.name).join(', '));if(!name)return;const i=items.find(x=>x.name.toLowerCase()===name.trim().toLowerCase());if(!i)return toast('Item not found. Use the exact item name.');const d=prompt('Discount percentage (1–90):','10');if(d===null||!Number.isFinite(Number(d))||Number(d)<1||Number(d)>90)return toast('Enter a discount between 1 and 90.');i.discount=Number(d);renderAll();toast('Offer created for '+i.name+'.')});
$('addIngredientBtn').addEventListener('click',()=>{const name=prompt('Ingredient name:');if(!name||!name.trim())return;const qty=prompt('Current quantity:','1');if(qty===null||!Number.isFinite(Number(qty))||Number(qty)<0)return toast('Enter a valid quantity.');const unit=prompt('Unit (kg, pcs, bunch, litre):','kg')||'units';const reorder=prompt('Reorder level:','3');if(reorder===null||!Number.isFinite(Number(reorder))||Number(reorder)<0)return toast('Enter a valid reorder level.');inventory.push({id:'inv'+Date.now(),name:name.trim(),qty:Number(qty),unit:unit.trim(),reorder:Number(reorder)});renderAll();toast('Ingredient added.')});
$('profileBtn').addEventListener('click',()=>toast('Demo mode: authentication is not connected to a server.'));
$('chartRange').addEventListener('change',e=>{const heights=e.target.value==='Last week'?[40,52,74,62,80,65,48]:[48,68,56,84,72,96,62];document.querySelectorAll('#dashboardChart .bar-col i').forEach((bar,i)=>bar.style.height=heights[i]+'%')});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if($(id)?.classList.contains('page-section'))showPage(id)});
renderAll();
const initial=location.hash.slice(1);if($(initial)?.classList.contains('page-section'))showPage(initial);
