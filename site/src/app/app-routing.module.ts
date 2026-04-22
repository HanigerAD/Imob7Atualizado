import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage/homepage.component';
import { ListPropertiesComponent } from './property/list-properties/list-properties.component';
import { ViewPropertyComponent } from './property/view-property/view-property.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NewsComponent } from './news/news.component';
import { ViewPostComponent } from './news/view-post/view-post.component';
import { PartnersComponent } from './partners/partners.component';
import { SellYourPropertyComponent } from './sell-your-property/sell-your-property.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'listando-imoveis', component: ListPropertiesComponent },
  { path: 'detalhes-imovel/:code', component: ViewPropertyComponent },
  { path: 'sobre-nos', component: AboutUsComponent },
  { path: 'noticias', component: NewsComponent },
  { path: 'artigo/:code', component: ViewPostComponent },
  { path: 'parceiros', component: PartnersComponent },
  { path: 'comercialize-seu-imovel', component: SellYourPropertyComponent },
  { path: 'contatos', component: ContactsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
