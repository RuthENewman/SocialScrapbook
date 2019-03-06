class CreateExperiences < ActiveRecord::Migration[5.2]
  def change
    create_table :experiences do |t|
      t.string :name
      t.datetime :date
      t.string :media_type
      t.string :media_url
      t.string :category
      t.text :comment

      t.timestamps
    end
  end
end
