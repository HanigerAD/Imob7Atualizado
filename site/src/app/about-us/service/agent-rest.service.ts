import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgentResponse } from '../integration/response/agent.response';

@Injectable()
export class AgentRestService {

  private endpoint: string = environment.endpoint.agent;

  constructor(
    private http: HttpClient
  ) { }

  public getAgent(code: number): Observable<AgentResponse> {
    return this.http.get<any>(`${this.endpoint}/${code}`);
  }

  public getAgents(): Observable<AgentResponse[]> {
    let params: HttpParams = new HttpParams();

    return this.http.get<any>(`${this.endpoint}`, { params });
  }

}
