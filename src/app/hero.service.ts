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
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
  
  /** GET hero by id. 404 if not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log('fetched hero id=${id}')),
      catchError(this.handleError<Hero>('getHero id=${id}'))
    );
  }

  /** PUT: update the hero on the server */
  updateHero (hero: Hero):Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log('updated hero id=${hero.id}')),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log('added hero w/ if=${newHero.id}')),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  /** Http header options */
  httpOptions = {
    headers:new HttpHeaders({ 'Content-Type': 'application/json' })
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
}
