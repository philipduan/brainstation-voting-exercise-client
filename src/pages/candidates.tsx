import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { signOut } from "../providers/trpc";
import {
  Container,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Candidates = () => {
  const currentHour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Canada/Eastern" })
  ).getHours();
  const withinTimeWindow = currentHour > 9 && currentHour < 18;
  const [candidateId, setCandidateId] = useState<string>("");
  const [voteDisabled, setVoteDisabled] = useState<boolean>(false);
  const userQuery = trpc.auth.getUserByToken.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const candidatesQuery = trpc.candidate.getAll.useQuery();
  const candidatesMutation = trpc.candidate.voteForId.useMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userQuery.error?.data?.httpStatus === 401) {
      signOut();
      navigate("/");
    }
  }, [userQuery.error?.data?.httpStatus, navigate]);

  const handleVote = () => {
    candidatesMutation.mutate(
      { candidateId },
      {
        onSuccess: () => {
          setVoteDisabled(true);
        },
      }
    );
  };

  return (
    <Container maxWidth="sm">
      <Stack mt={5}>
        <Typography variant="h4" align="center">
          Please select a candidate for the next election
        </Typography>
        <Select
          value={candidateId}
          onChange={(e) => {
            setCandidateId(e.target.value);
          }}
        >
          {candidatesQuery.data?.map((candidate) => (
            <MenuItem value={candidate._id}>
              {candidate.name}
              &nbsp;&nbsp;
              <b>{candidate.party}</b>
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={handleVote}
          disabled={voteDisabled || userQuery.data?.voted || !withinTimeWindow}
        >
          {userQuery.data?.voted
            ? "You already voted"
            : withinTimeWindow
            ? "Vote"
            : "Voting is between 9AM and 5PM EST"}
        </Button>
      </Stack>
    </Container>
  );
};

export default Candidates;
