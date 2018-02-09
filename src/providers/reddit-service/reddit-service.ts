import { Injectable } from '@angular/core';

@Injectable()
export class RedditServiceProvider {

  private feeds: Array<any>;

  constructor() {
  }

  fetchData(url: string): Promise<any>{

    return new Promise(resolve => {

      fetch(url)
      .then(res => res.json())
        .then(data => {
          this.feeds = data.data.children;
          
          this.feeds.forEach((e) => {
            if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
              e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
            }
          })
          resolve(this.feeds);
        })
        .catch(error => console.log(error));          
    });
  }

}
