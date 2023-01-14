var items = {
  // (A) LOAD SUPPLIER ITEMS PAGE
  pg : 1, // current page
  find : "", // current search
  id : null, // current supplier id
  init : id => {
    items.pg = 1;
    items.find = "";
    items.id = id;
    cb.page(1);
    cb.load({
      page : "suppliers/items",
      target : "cb-page-2",
      data : { id : id },
      onload : () => items.list()
    });
  },

  // (B) LIST () : SHOW SUPPLIER ITEMS
  list : silent => {
    if (silent!==true) { cb.page(1); }
    cb.load({
      page : "suppliers/items/list", target : "item-list",
      data : {
        id : items.id,
        page : items.pg,
        search : items.find
      }
    });
  },

  // (C) GO TO PAGE
  //  pg : page number
  goToPage : pg => { if (pg!=items.pg) {
    items.pg = pg;
    items.list();
  }},

  // (D) SEARCH ITEMS
  search : () => {
    items.find = document.getElementById("item-search").value;
    items.pg = 1;
    items.list();
    return false;
  },

  // (E) SHOW ADD/EDIT DOCKET
  //  id : item sku, for edit only
  addEdit : sku => cb.load({
    page : "suppliers/items/form", target : "cb-page-3",
    data : {
      sku : sku ? sku : "",
      id : items.id
    },
    onload : () => cb.page(2)
  }),

  // (F) SAVE ITEM
  save : () => {
    // (F1) AUTO SUPPLIER SKU
    var sku = document.getElementById("item-sku"),
        ssku = document.getElementById("item-ssku"),
        osku = document.getElementById("item-osku");
    if (ssku.value=="") { ssku.value = sku.value; }

    // (F2) GET FORM DATA
    var data = {
      id : items.id,
      sku : sku.value,
      ssku : ssku.value,
      price : document.getElementById("item-price").value
    };
    if (osku.value!="") { data.osku = osku.value; }

    // (F3) AJAX
    cb.api({
      mod : "suppliers", req : "saveItem",
      data : data,
      passmsg : "Supplier item saved",
      onpass : items.list
    });
    return false;
  },

  // (G) DELETE ITEM
  //  sku : item sku
  del : sku => cb.modal("Please confirm", `Remove this item from the supplier?`, () => cb.api({
    mod : "suppliers", req : "delItem",
    data : { id : items.id, sku : sku },
    passmsg : "Supplier item deleted",
    onpass : items.list
  }))
};