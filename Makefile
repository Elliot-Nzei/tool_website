.PHONY: all run run-backend clean

all: run

run: run-backend
	@echo "Frontend is ready. Please open C:/Users/USER/Documents/PROJECTS_2025/tool_website/frontend/pages/index.html in your web browser."
	@echo "To stop the backend, find the process running 'python app.py' and terminate it (e.g., using Task Manager on Windows or 'kill <PID>' on Linux/macOS)."

run-backend:
	@echo "Starting Flask backend in the background..."
	@cd backend && python app.py &

clean:
	@echo "Cleaning up..."
	@rm -rf backend/temp
	@echo "Cleanup complete."