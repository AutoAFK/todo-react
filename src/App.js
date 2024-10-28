import { useRef, useState } from "react";

function App() {
	const [newTask, setNewTask] = useState("");
	const [taskList, setTaskList] = useState(
		localStorage.getItem("task_list")
			? JSON.parse(localStorage.getItem("task_list"))
			: {},
	);
	const [trigger, setTrigger] = useState(false);
	const ref = useRef(null);

	function onChangeNewTask(event) {
		setNewTask(event.target.value);
	}

	function onSetTrigger() {
		setTrigger(!trigger);
	}

	function onSetTaskDone(uuid, isDone) {
		setTaskList((prevTaskList) => {
			const updatedTaskList = { ...prevTaskList };
			updatedTaskList[uuid].isDone = isDone;
			localStorage.setItem("task_list", JSON.stringify(updatedTaskList));
			return updatedTaskList;
		});
	}

	function submitNewTask(event) {
		event.preventDefault();
		setTaskList((prevTaskList) => {
			const updatedTaskList = {
				...prevTaskList,
				[crypto.randomUUID()]: { task: newTask, isDone: false },
			};
			localStorage.setItem("task_list", JSON.stringify(updatedTaskList));
			return updatedTaskList;
		});

		setNewTask("");
		ref.current.focus();
	}

	function removeTask(uuid) {
		setTaskList((prevTaskList) => {
			const updatedTaskList = { ...prevTaskList };
			delete updatedTaskList[uuid];
			localStorage.setItem("task_list", JSON.stringify(updatedTaskList));
			return updatedTaskList;
		});
	}

	return (
		<>
			<div className={`text-center mx-10 ${trigger ? "opacity-50" : ""}`}>
				<h1 className="text-4xl font-bold mb-2">Todo list</h1>
				<button
					type="button"
					className="border border-gray-400 rounded-lg px-2 text-lg"
					onClick={onSetTrigger}
				>
					Add Task
				</button>

				<hr className="my-4" />
				<ul>
					{Object.entries(taskList).map(([k, v]) => {
						console.log(v);
						return (
							<li
								key={k}
								className="text-left border border-gray-400 my-2 rounded-lg py-2 px-4 flex justify-between items-center "
							>
								<div>
									<input
										type="checkbox"
										checked={v.isDone}
										onChange={(e) => onSetTaskDone(k, e.target.checked)}
										className="mr-2"
									/>
									<span className="text-lg">{v.task}</span>
								</div>
								<button
									type="button"
									className="border border-black rounded-lg px-2 py-1"
									onClick={() => removeTask(k)}
								>
									Remove
								</button>
							</li>
						);
					})}
				</ul>
			</div>
			<Popup
				trigger={trigger}
				setTrigger={onSetTrigger}
				submitNewTask={submitNewTask}
				newTask={newTask}
				onChangeNewTask={onChangeNewTask}
				inputRef={ref}
			/>
		</>
	);
}

function Popup({
	trigger,
	setTrigger,
	submitNewTask,
	newTask,
	onChangeNewTask,
	inputRef,
}) {
	if (!trigger) return null;
	return (
		<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
			<div className="p-10 border border-black rounded-lg flex items-center text-lg">
				<form
					onSubmit={submitNewTask}
					className="flex flex-col items-center mb-5"
				>
					<label htmlFor="new_task" className="mb-1 self-start">
						Add Task
					</label>
					<input
						type="text"
						value={newTask}
						onChange={onChangeNewTask}
						ref={inputRef}
						className="border border-gray-400 rounded-lg mb-5"
					/>

					<div>
						<input
							type="submit"
							className="border rounded-lg bg-slate200 px-2"
						/>
						<button
							type="button"
							className="border rounded-lg bg-slate200 px-2 ml-2"
							onClick={setTrigger}
						>
							Close
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default App;
