import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient ) { }
  
  private heroesUrl = 'api/heroes'; //Url to web api

  /** Log a HeroService message with the MessageService */
  private log(message: string){
    this.messageService.add('HeroService: ${message}');
  }
  
  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
  
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  
 private handleError<T>(operation = 'operation', result?:T){
   return (error: any): Observable<T> => {

    //TODO: send the error to remote logging infrastructure
    console.error(error);//log to console

    //TODO: transforming error for user consumption
    this.log('${operation} failer: ${error.message}');

    // Keep app running by returning empty result
    return of(result as T);
   }
 }


  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }

}
