class ExperiencesController < ApplicationController

  def index
    @experiences = Experience.all
    render json: @experiences
  end

  def show
    @experience = Experience.find(params[:id])
    render json: @experience
  end

  def new
    @experience = Experience.new
  end

  def create
    @experience = Experience.create_or_find_by(experience_params)
    if @experience
      render json: @experience
    else
      render json: {error: 'Unable to create experience.'}
    end
  end

  def update
    @experience = Experience.find(params[:id])
    if @experience.update(experience_params)
      render json: @experience
    else
      render json: {error: 'Unable to update experience.'}
    end
  end

  def destroy
    @experience = Experience.find_by(id: params[:id])
    if @experience
      @experience.destroy
      render json: {message: 'Experience deleted.'}
    else
      render json: {error: 'Experience not found.'}, status: 404
    end
  end

  private

  def experience_params
    params.require(:experience).permit(:name, :date, :media_type, :media_url, :category, :comment)
  end

end
