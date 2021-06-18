import IDbItems from "./IDbItems";
import IMovieGenres from "./IMovieGenres";

export default interface IMovie extends IDbItems{
    adult: Boolean;
    budget: Number;
    genres: Array<IMovieGenres>;
    release_date: String;
    title: String;
    success: Boolean;
    vote_average?: Number;
}