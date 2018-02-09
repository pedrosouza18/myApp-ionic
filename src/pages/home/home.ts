import { Component } from '@angular/core';
import { NavController, LoadingController, ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public feeds: Array<string>;
  public noFilter: Array<any>;
  public hasFilter: boolean = false;

  private url: string = "https://www.reddit.com/new.json";
  private olderPosts: string = "https://www.reddit.com/new.json?after=";
  private newerPosts: string = "https://www.reddit.com/new.json?before=";

  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController, 
    public actionSheetCtrl: ActionSheetController) {
      this.fetchContent();
  }
  
  fetchContent(): void {
    let loading = this.loadingCtrl.create({
      content: 'Fetching content...'
    });

    loading.present();

    fetch(this.url)
      .then(res => res.json())
      .then(data => {
        this.feeds = data.data.children;
        this.feeds.forEach((e, i, a) => {
          if(!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1){
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
        });
        this.noFilter = this.feeds;
        this.hasFilter = false;
        loading.dismiss();
      }); 
  }

  itemSelected(feed): void {
    alert(feed.data.url);
  }

  doInfinite(infiniteScroll) {
    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";

    fetch(this.olderPosts + paramsUrl)
      .then(res => res.json())
      .then(data => {
        this.feeds = this.feeds.concat(data.data.children);
        this.feeds.forEach((e, i, a) => {
          if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
        })
        infiniteScroll.complete();
        this.noFilter = this.feeds;
        this.hasFilter = false;
      }); 
  }

  doRefresh(refresher) {

    let paramsUrl = this.feeds[0].data.name;

    fetch(this.newerPosts + paramsUrl)
      .then(res => res.json())
      .then(data => {
        this.feeds = data.data.children.concat(this.feeds);
        this.feeds.forEach((e, i, a) => {
          if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
        })
        this.noFilter = this.feeds;
        this.hasFilter = false;
        refresher.complete();
      }); 
  }

  showFilters() :void {    

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Filter options:',
      buttons: [
        {
          text: 'Music',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "music");
            this.hasFilter = true;
          }
        },
        {
          text: 'Movies',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "movies");
            this.hasFilter = true;
          }
        },
        {
          text: 'Games',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "gaming");
            this.hasFilter = true;
          }
        },
        {
          text: 'Pictures',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "pics");
            this.hasFilter = true;
          }
        },                
        {
          text: 'Ask Reddit',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "askreddit");
            this.hasFilter = true;
          }
        },        
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.feeds = this.noFilter;
            this.hasFilter = false;
          }
        }
      ]
    });

    actionSheet.present();

  }        

}
