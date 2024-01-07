import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WorkFlowDto, setWorkflow } from '@/store/workflow';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

const NewWorkFlow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState('');
  const createNewFlow = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const workflowPayload: WorkFlowDto = {
      name: workflowName,
      workFlowEdges: [],
      workFlowNodes: [],
      id: uuid(),
    };

    dispatch(setWorkflow(workflowPayload));
    navigate(`/workflow/${workflowPayload.id}`);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Create New Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={createNewFlow}>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Create a new workflow by giving it a name
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <Input
                id="name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                required
                placeholder="my first workflow"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkFlow;
