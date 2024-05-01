import { getClient } from "@/utils/";
import {gql} from "@apollo/client";
const GET_ARTIST_BY_ID = gql`
    query query($id: ID!) {
        getArtistById(_id: $id) {
            _id
            created_date
            date_of_birth
        }
    }
`;

const Artist: React.FC = async ({params}) => {
    const client = getClient();
    const { data } = await client.query({ query: GET_ARTIST_BY_ID , variables: { id: params.id }});

    return (
        <div>
            <h1>Artists</h1>
            <ul>
                {data.getArtistById._id}
                {data.getArtistById.created_date}
            </ul>
        </div>
    );
};

export default Artist;

